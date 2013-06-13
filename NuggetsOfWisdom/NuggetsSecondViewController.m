//
//  NuggetsSecondViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsSecondViewController.h"
#import <Parse/Parse.h>
#import <QuartzCore/QuartzCore.h>

@interface NuggetsSecondViewController ()

@property (weak, nonatomic) IBOutlet UIButton *nextButton;

@end

@implementation NuggetsSecondViewController

//- (void)viewWillAppear:(BOOL)animated
//{
//    [super viewWillAppear:animated];
//}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    PFUser *currentUser = [PFUser currentUser];
    if (!currentUser)
    {
        [self performSegueWithIdentifier:@"goToRegister" sender: self];
    }
    else
    {
        [self.stuffToShow1 setHidden:YES];
        [self.stuffToShow2 setHidden:YES];
        
        dispatch_queue_t loaderQ = dispatch_queue_create("loader", NULL);
        dispatch_async(loaderQ, ^{
            PFQuery *query = [PFQuery queryWithClassName:@"Nugget"];
            [query orderByDescending:@"createdAt"];
            NSArray *nuggets = [query findObjects];
            dispatch_async(dispatch_get_main_queue(), ^{
                self.nuggets = nuggets;
                self.nuggetIndex = 0;
                
                UIColor* neutralColor = [UIColor colorWithWhite:0.4 alpha:1.0];
                NSString* fontName = @"Avenir-Book";
                self.nuggetLabel.textColor =  neutralColor;
                self.nuggetLabel.font =  [UIFont fontWithName:fontName size:16.0f];
                self.nuggetLabel.text = self.nuggets[self.nuggetIndex][@"text"];
            });
        });
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)updateNuggetLabel
{
    CAKeyframeAnimation *scaleAnimation =
    [CAKeyframeAnimation animationWithKeyPath:@"transform"];
    
    // Set the animation's delegate to self so that we can add callbacks if we want
    scaleAnimation.delegate = self;
    
    // Create the transform; we'll scale x and y by 1.5, leaving z alone
    // since this is a 2D animation.
    CATransform3D transform = CATransform3DMakeScale(1.5, 1.5, 1); // Scale in x and y
    
    // Add the keyframes.  Note we have to start and end with CATransformIdentity,
    // so that the label starts from and returns to its non-transformed state.
    [scaleAnimation setValues:[NSArray arrayWithObjects:
                               [NSValue valueWithCATransform3D:CATransform3DIdentity],
                               [NSValue valueWithCATransform3D:transform],
                               [NSValue valueWithCATransform3D:CATransform3DIdentity],
                               nil]];
    
    // set the duration of the animation
    [scaleAnimation setDuration: .5];
    
    // animate your label layer = rock and roll!
    [[self.nuggetLabel layer] addAnimation:scaleAnimation forKey:@"scaleText"];
    
    self.nuggetIndex += 1;
    if ([self.nuggets count] != 0 && (self.nuggetIndex >= [self.nuggets count] || self.nuggetIndex > 3))
    {
        //self.nuggetIndex = 0;
        [self.stuffToHide1 setHidden:YES];
        [self.stuffToHide2 setHidden:YES];
        [self.stuffToHide3 setHidden:YES];
        [self.stuffToHide4 setHidden:YES];
        [self.stuffToHide5 setHidden:YES];
        [self.nuggetLabel setHidden:YES];
        
        [self.stuffToShow1 setHidden:NO];
        [self.stuffToShow2 setHidden:NO];
    }
    else
    {
        self.nuggetLabel.text = self.nuggets[self.nuggetIndex][@"text"];
    }
}

- (IBAction)forgotButtonClicked:(UIButton *)sender
{
    [self updateNuggetLabel];
}

- (IBAction)rememberedButtonClicked:(UIButton *)sender
{
    [self updateNuggetLabel];
}

@end
