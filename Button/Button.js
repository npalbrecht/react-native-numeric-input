import React from 'react';
import {
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
} from 'react-native';

function _handlePress(callback) {
    if (callback) {
        requestAnimationFrame(callback);
    }
}

const Button = ({ children, disabled = false, onPress = () => {}, style }) => {
    const handlePress = () => _handlePress(onPress);

    if (Platform.OS === 'ios') {
        return (
            <TouchableOpacity disabled={disabled} style={style} onPress={handlePress}>
                {children}
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableNativeFeedback disabled={disabled} onPress={handlePress}>
                <View style={style}>{children}</View>
            </TouchableNativeFeedback>
        );
    }
};

export default Button;
