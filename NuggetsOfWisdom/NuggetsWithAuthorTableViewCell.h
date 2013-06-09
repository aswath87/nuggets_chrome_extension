//
//  NuggetsWithAuthorTableViewCell.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/9/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NuggetsWithAuthorTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UIImageView *authorPic;
@property (weak, nonatomic) IBOutlet UILabel *authorName;
@property (weak, nonatomic) IBOutlet UILabel *nuggetLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetTagsLabel;
@property (weak, nonatomic) IBOutlet UILabel *nuggetSourceLabel;

@end
