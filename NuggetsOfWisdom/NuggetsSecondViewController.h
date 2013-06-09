//
//  NuggetsSecondViewController.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NuggetsSecondViewController : UIViewController

@property (nonatomic, strong) NSArray *nuggets;
@property (weak, nonatomic) IBOutlet UILabel *nuggetLabel;
@property (nonatomic) int nuggetIndex;
@property (weak, nonatomic) IBOutlet UIButton *stuffToHide1;
@property (weak, nonatomic) IBOutlet UILabel *stuffToHide2;
@property (weak, nonatomic) IBOutlet UIButton *stuffToHide3;
@property (weak, nonatomic) IBOutlet UILabel *stuffToHide4;
@property (weak, nonatomic) IBOutlet UIImageView *stuffToHide5;
@property (weak, nonatomic) IBOutlet UILabel *stuffToShow1;
@property (weak, nonatomic) IBOutlet UILabel *stuffToShow2;

@end
