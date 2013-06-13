//
//  NuggetsTableViewCell.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsTableViewCell.h"

@implementation NuggetsTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

- (void)awakeFromNib
{
    
    UIColor* mainColor = [UIColor colorWithRed:28.0/255 green:158.0/255 blue:121.0/255 alpha:1.0f];
    UIColor* neutralColor = [UIColor colorWithWhite:0.4 alpha:1.0];
    
    NSString* fontName = @"Avenir-Book";
    NSString* boldItalicFontName = @"Avenir-BlackOblique";
    NSString* boldFontName = @"Avenir-Black";
    
    self.nuggetSourceLabel.textColor =  mainColor;
    self.nuggetSourceLabel.font =  [UIFont fontWithName:boldFontName size:14.0f];
    
    self.nuggetLabel.textColor =  neutralColor;
    self.nuggetLabel.font =  [UIFont fontWithName:fontName size:14.0f];
    
    self.nuggetTag.textColor = mainColor;
    self.nuggetTag.font =  [UIFont fontWithName:boldItalicFontName size:12.0f];
    
    self.selectionStyle = UITableViewCellSelectionStyleNone;
}

@end
