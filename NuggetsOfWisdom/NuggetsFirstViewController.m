//
//  NuggetsFirstViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsFirstViewController.h"
#import <Parse/Parse.h>

@interface NuggetsFirstViewController ()

#define UIColorFromRGB(rgbValue) [UIColor \
colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
green:((float)((rgbValue & 0xFF00) >> 8))/255.0 \
blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]

@end

@implementation NuggetsFirstViewController

- (Nugget *)createNugget:(NSString *)text withSource:(NSString *)source withTags:(NSString *)tag
{
    Nugget *newNugget = [[Nugget alloc] init];
    newNugget.nugget = text;
    newNugget.source = source;
    newNugget.tag = tag; //[tags componentsSeparatedByString:@","];
    return newNugget;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    [self performSegueWithIdentifier:@"goToRegister" sender: self];
//    [self.tabBarController setSelectedIndex:2];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	
    NSString* boldFontName = @"GillSans-Bold";
    [self styleNavigationBarWithFontName:boldFontName];
    
    NSString* fontName = @"Avenir-Book";
    
    self.NuggetToAdd.backgroundColor = [UIColor colorWithRed:237.0/255 green:243.0/255 blue:245.0/255 alpha:1.0f];
    self.NuggetToAdd.placeholder = @"What did you learn?";
    self.NuggetToAdd.leftViewMode = UITextFieldViewModeAlways;
    self.NuggetToAdd.font = [UIFont fontWithName:fontName size:16.0f];
    
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
    [nuggetObject setObject:nugget.nugget forKey:@"Content"];
    [nuggetObject setObject:nugget.source forKey:@"Source"];
    [nuggetObject setObject:nugget.tag forKey:@"Tag"];
    [nuggetObject save];
}

- (IBAction)addNewNugget:(UIButton *)sender
{
    Nugget *newNugget = [self createNugget:self.NuggetToAdd.text withSource:self.NuggetToAddSource.text withTags:self.NuggetToAddTags.text];
    [self addNuggetToBasket:newNugget];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
}

- (void)styleNavigationBarWithFontName:(NSString*)navigationTitleFont{
    
    
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
