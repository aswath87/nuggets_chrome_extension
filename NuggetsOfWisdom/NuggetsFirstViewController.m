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

#define maxNuggetCharacterLength 140
#define nuggetTextViewPlaceholderText @"What did you learn?"

@end

@implementation NuggetsFirstViewController

- (Nugget *)createNugget:(NSString *)text withSource:(NSString *)source withTags:(NSString *)tags
{
    Nugget *newNugget = [[Nugget alloc] init];
    newNugget.nugget = text;
    newNugget.source = source;
    newNugget.tags = [tags componentsSeparatedByString:@","];
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
//        [self.nuggetText becomeFirstResponder];
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSString* boldFontName = @"GillSans-Bold";
    [self styleNavigationBarWithFontName:boldFontName]; // assumes this first view controller is opened first
    NSString* fontName = @"Avenir-Book";
    
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
    [nuggetObject saveEventually];
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
    else
    {
        Nugget *newNugget = [self createNugget:self.nuggetText.text
                                    withSource:self.NuggetToAddSource.text
                                      withTags:self.NuggetToAddTags.text];
        [self addNuggetToBasket:newNugget];
        
        self.nuggetText.text = nuggetTextViewPlaceholderText;
        self.nuggetText.textColor = [UIColor lightGrayColor];
        self.NuggetToAddSource.text = @"";
        self.NuggetToAddTags.text = @"";
        
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

- (void)textViewDidChange:(UITextView *)textView {
    //create NSString containing the text from the UITextView
    NSString *substring = [NSString stringWithString:textView.text];
    
    if (substring.length > maxNuggetCharacterLength)
    {
        self.nuggetCharacterCounter.textColor = [UIColor redColor];
    }
    else if (substring.length <= maxNuggetCharacterLength) {
        self.nuggetCharacterCounter.textColor = [UIColor blackColor];
    }
    self.nuggetCharacterCounter.text = [NSString stringWithFormat:@"%d",maxNuggetCharacterLength - [substring length]];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
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
