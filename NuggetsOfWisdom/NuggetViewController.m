//
//  NuggetViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 9/17/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetViewController.h"

@interface NuggetViewController ()

@end

@implementation NuggetViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    UIColor* mainColor = [UIColor colorWithRed:28.0/255 green:158.0/255 blue:121.0/255 alpha:1.0f];
    UIColor* neutralColor = [UIColor colorWithWhite:0.4 alpha:1.0];
    
    NSString* fontName = @"Avenir-Book";
    NSString* boldItalicFontName = @"Avenir-BlackOblique";
    NSString* boldFontName = @"Avenir-Black";
    
    self.nuggetTextLabel.textColor =  neutralColor;
    self.nuggetTextLabel.font =  [UIFont fontWithName:fontName size:14.0f];
    
    self.nuggetSourceLabel.textColor =  mainColor;
    self.nuggetSourceLabel.font =  [UIFont fontWithName:boldFontName size:14.0f];
    
    self.nuggetTagsLabel.textColor = mainColor;
    self.nuggetTagsLabel.font =  [UIFont fontWithName:boldItalicFontName size:12.0f];
	
    self.nuggetTextLabel.text = self.nugget;
    self.nuggetSourceLabel.text = self.nuggetSource;
    self.nuggetTagsLabel.text = self.nuggetTags;
    
    [self.nuggetTextLabel sizeToFit];
    [self.nuggetSourceLabel sizeToFit];
    [self.nuggetTagsLabel sizeToFit];
}

- (void)setNugget:(NSString *)nugget
{
    _nugget = nugget;
}

- (void)setNuggetSource:(NSString *)nuggetSource
{
    _nuggetSource = nuggetSource;
}

- (void)setNuggetTags:(NSString *)nuggetTags
{
    _nuggetTags = nuggetTags;
}

@end
