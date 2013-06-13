//
//  NuggetsTableViewCell.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NuggetsTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *nuggetSourceLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetTag;

@end
