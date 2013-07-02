//
//  NuggetsFirstViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsFirstViewController.h"
#import <Parse/Parse.h>
#import <QuartzCore/QuartzCore.h>

@interface NuggetsFirstViewController ()

#define maxNuggetCharacterLength 200
#define nuggetTextViewPlaceholderText @"What did you learn?"
#define fontName @"Avenir-Book"

@end

@implementation NuggetsFirstViewController

- (Nugget *)createNugget:(NSString *)text withSource:(NSString *)source withTags:(NSMutableArray *)tags
{
    Nugget *newNugget = [[Nugget alloc] init];
    newNugget.nugget = text;
    newNugget.source = source;
    newNugget.tags = tags;
    return newNugget;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    PFUser *currentUser = [PFUser currentUser];
    if (!currentUser)
    {
        [self performSegueWithIdentifier:@"goToRegister" sender: self];
    }
    else
    {
        [self updateNuggetCharacterCounter:self.nuggetText];
//        [self.nuggetText becomeFirstResponder];
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSString* boldFontName = @"GillSans-Bold";
    [self styleNavigationBarWithFontName:boldFontName]; // assumes this first view controller is opened first
    
    [self styleNavigationBarWithFontName:boldFontName];
    
    self.nuggetText.backgroundColor = [UIColor colorWithRed:237.0/255 green:243.0/255 blue:245.0/255 alpha:1.0f];
    self.nuggetText.layer.borderColor = [[UIColor grayColor] CGColor];
    self.nuggetText.layer.borderWidth = 2.0f;
    self.nuggetText.text = nuggetTextViewPlaceholderText;
    self.nuggetText.textColor = [UIColor lightGrayColor];
    self.nuggetText.font = [UIFont fontWithName:fontName size:16.0f];
    self.nuggetText.delegate = self;
    
    self.NuggetToAddSource.backgroundColor = [UIColor colorWithRed:237.0/255 green:243.0/255 blue:245.0/255 alpha:1.0f];
    self.NuggetToAddSource.placeholder = @"Where? url / person / place";
    self.NuggetToAddSource.leftViewMode = UITextFieldViewModeAlways;
    self.NuggetToAddSource.font = [UIFont fontWithName:fontName size:16.0f];
    
    self.NuggetToAddTags.backgroundColor = [UIColor colorWithRed:237.0/255 green:243.0/255 blue:245.0/255 alpha:1.0f];
    self.NuggetToAddTags.placeholder = @"Tags";
    self.NuggetToAddTags.leftViewMode = UITextFieldViewModeAlways;
    self.NuggetToAddTags.font = [UIFont fontWithName:fontName size:16.0f];
    self.NuggetToAddTags.delegate = self;
    
    self.tags = [[NSMutableArray alloc] init];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)addNuggetToBasket:(Nugget *)nugget
{
    PFObject *nuggetObject = [PFObject objectWithClassName:@"Nugget"];
    [nuggetObject setObject:[PFUser currentUser] forKey:@"owner"];
    [nuggetObject setObject:nugget.nugget forKey:@"text"];
    [nuggetObject setObject:nugget.source forKey:@"source"];
    [nuggetObject setObject:nugget.tags forKey:@"tags"];
    
    PFObject *nuggetUserObject = [PFObject objectWithClassName:@"Nugget_User"];
    [nuggetUserObject setObject:[PFUser currentUser] forKey:@"user"];
    [nuggetUserObject setObject:nuggetObject forKey:@"nugget"];
    [nuggetUserObject saveEventually];
}

- (void)attemptSaveNugget
{
    if (self.nuggetText.textColor == [UIColor lightGrayColor]
        || [self.nuggetText.text length] == 0)
    {
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Incomplete entry"
                                                          message:@"Enter a nugget!"
                                                         delegate:nil
                                                cancelButtonTitle:@"OK"
                                                otherButtonTitles:nil];
        [message show];
    }
    else if ([self.nuggetText.text length] > maxNuggetCharacterLength)
    {
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Nugget too long"
                                                          message:[NSString stringWithFormat:@"Nugget can't be more than %d characters!", maxNuggetCharacterLength]
                                                         delegate:nil
                                                cancelButtonTitle:@"OK"
                                                otherButtonTitles:nil];
        [message show];
    }
    else
    {
        Nugget *newNugget = [self createNugget:self.nuggetText.text
                                    withSource:self.NuggetToAddSource.text
                                      withTags:self.tags];
        [self addNuggetToBasket:newNugget];
        
        self.nuggetText.text = nuggetTextViewPlaceholderText;
        self.nuggetText.textColor = [UIColor lightGrayColor];
        self.NuggetToAddSource.text = @"";
        self.NuggetToAddTags.text = @"";
        self.tags = [[NSMutableArray alloc] init];
        [self.tagsCollectionView reloadData];
        
        [self.tabBarController setSelectedIndex:2]; // go to Me tab
    }
}

- (IBAction)plusSignClicked:(id)sender
{
    [self attemptSaveNugget];
}

- (IBAction)saveButtonClicked:(id)sender
{
    [self attemptSaveNugget];
}

- (void)textViewDidBeginEditing:(UITextView *)textView
{
    if ([textView.text isEqualToString:nuggetTextViewPlaceholderText])
    {
        textView.text = @"";
        textView.textColor = [UIColor blackColor];
    }
    [textView becomeFirstResponder];
}

- (void)textViewDidEndEditing:(UITextView *)textView
{
    if ([textView.text isEqualToString:@""]) {
        textView.text = nuggetTextViewPlaceholderText;
        textView.textColor = [UIColor lightGrayColor];
    }
    [textView resignFirstResponder];
}

- (void)updateNuggetCharacterCounter:(UITextView *)textView
{
    NSString *substring = @"";
    if (self.nuggetText.textColor != [UIColor lightGrayColor])
    {
        substring = [NSString stringWithString:textView.text];
    }
    
    if (substring.length > maxNuggetCharacterLength)
    {
        self.nuggetCharacterCounter.textColor = [UIColor redColor];
    }
    else if (substring.length <= maxNuggetCharacterLength) {
        self.nuggetCharacterCounter.textColor = [UIColor blackColor];
    }
    self.nuggetCharacterCounter.text = [NSString stringWithFormat:@"%d",maxNuggetCharacterLength - [substring length]];
}

- (void)textViewDidChange:(UITextView *)textView
{
    [self updateNuggetCharacterCounter:textView];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
}

- (void)addTag
{
    if (self.NuggetToAddTags.text.length > 0)
    {
        [self.tags addObject:self.NuggetToAddTags.text];
        self.NuggetToAddTags.text = @"";
        [self.tagsCollectionView reloadData];
    }
}

- (IBAction)addTagButtonClicked:(id)sender
{
    [self addTag];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [self addTag];
    return YES;
}

- (NSInteger)collectionView:(UICollectionView *)view numberOfItemsInSection:(NSInteger)section
{
    return [self.tags count];
}

- (NSInteger)numberOfSectionsInCollectionView: (UICollectionView *)collectionView
{
    return 1;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)cv cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    TagCollectionViewCell *cell = [cv dequeueReusableCellWithReuseIdentifier:@"TagCell" forIndexPath:indexPath];
    
    cell.tagLabel.text = self.tags[indexPath.row];
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    
    CGSize expectedLabelSize = [self.tags[indexPath.row] sizeWithFont:[UIFont fontWithName:fontName size:16.0f]];
    expectedLabelSize.width *= 1.1; // hack because expectedLabelSize.width cuts off a bit of long words
    return expectedLabelSize;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section
{
    return 10.0f;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section
{
    return 1.0f;
}

- (void)styleNavigationBarWithFontName:(NSString*)navigationTitleFont
{
    CGSize size = CGSizeMake(320, 44);
    UIColor* color = [UIColor colorWithRed:50.0/255 green:102.0/255 blue:147.0/255 alpha:1.0f];
    
    UIGraphicsBeginImageContext(size);
    CGContextRef currentContext = UIGraphicsGetCurrentContext();
    CGRect fillRect = CGRectMake(0,0,size.width,size.height);
    CGContextSetFillColorWithColor(currentContext, color.CGColor);
    CGContextFillRect(currentContext, fillRect);
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    
    UINavigationBar* navAppearance = [UINavigationBar appearance];
    
    [navAppearance setBackgroundImage:image forBarMetrics:UIBarMetricsDefault];
    
    [navAppearance setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                           [UIColor whiteColor], UITextAttributeTextColor,
                                           [UIFont fontWithName:navigationTitleFont size:18.0f], UITextAttributeFont, [NSValue valueWithCGSize:CGSizeMake(0.0, 0.0)], UITextAttributeTextShadowOffset,
                                           nil]];
    UIImageView* searchView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"search.png"]];
    
    UIBarButtonItem* searchItem = [[UIBarButtonItem alloc] initWithCustomView:searchView];
    
    self.navigationItem.rightBarButtonItem = searchItem;
}


@end
