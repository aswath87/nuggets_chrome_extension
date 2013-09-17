//
//  NuggetViewController.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 9/17/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NuggetViewController : UIViewController

@property (nonatomic) NSString *nugget;
@property (nonatomic) NSString *nuggetSource;
@property (nonatomic) NSString *nuggetTags;

@property (weak, nonatomic) IBOutlet UILabel *nuggetTextLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetSourceLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetTagsLabel;

- (void)setNugget:(NSString *)nugget;
- (void)setNuggetSource:(NSString *)nuggetSource;
- (void)setNuggetTags:(NSString *)nuggetTags;

@end
