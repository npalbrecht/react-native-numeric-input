import React, { useState, useRef, useEffect } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from '../Button/Button'
import { create, PREDEF_RES } from 'react-native-pixel-perfect'

let calcSize = create(PREDEF_RES.iphone7.px)

const NumericInput = ({
    iconSize = calcSize(30),
    borderColor = '#d4d4d4',
    iconStyle = {},
    totalWidth = calcSize(220),
    totalHeight,
    separatorWidth = 1,
    type = 'plus-minus',
    valueType = 'integer',
    rounded = false,
    textColor = 'black',
    containerStyle = {},
    inputStyle = {},
    initValue = 0,
    value = null,
    minValue = null,
    maxValue = null,
    step = 1,
    upDownButtonsBackgroundColor = 'white',
    rightButtonBackgroundColor = 'white',
    leftButtonBackgroundColor = 'white',
    editable = true,
    validateOnBlur = true,
    reachMaxIncIconStyle = {},
    reachMaxDecIconStyle = {},
    reachMinIncIconStyle = {},
    reachMinDecIconStyle = {},
    onLimitReached = (isMax, msg) => { },
    onBlur,
    onFocus,
    onChange,
    extraTextInputProps = {},
}) => {
    const [internalValue, setInternalValue] = useState(initValue !== 0 || initValue ? initValue : value || 0)
    const [stringValue, setStringValue] = useState((initValue !== 0 || initValue ? initValue : value || 0).toString())
    const [lastValid, setLastValid] = useState(initValue !== 0 || initValue ? initValue : value || 0)
    const inputRef = useRef(null)

    useEffect(() => {
        if (value !== null && value !== internalValue) {
            setInternalValue(value)
            setLastValid(value)
            setStringValue(value.toString())
        }
    }, [value])

    const updateBaseResolution = (width, height) => {
        calcSize = create({ width, height })
    }

    const inc = () => {
        let newValue = (internalValue + step).toFixed(12)
        newValue = valueType === 'real' ? parseFloat(newValue) : parseInt(newValue)
        if (maxValue === null || newValue <= maxValue) {
            setInternalValue(newValue)
            setStringValue(newValue.toString())
            onChange && onChange(newValue)
        } else {
            onLimitReached(true, 'Reached Maximum Value!')
            setInternalValue(maxValue)
            setStringValue(maxValue.toString())
            onChange && onChange(maxValue)
        }
    }

    const dec = () => {
        let newValue = (internalValue - step).toFixed(12)
        newValue = valueType === 'real' ? parseFloat(newValue) : parseInt(newValue)
        if (minValue === null || newValue >= minValue) {
            setInternalValue(newValue)
            setStringValue(newValue.toString())
            onChange && onChange(newValue)
        } else {
            onLimitReached(false, 'Reached Minimum Value!')
            setInternalValue(minValue)
            setStringValue(minValue.toString())
            onChange && onChange(minValue)
        }
    }

    const isLegalValue = (value, mReal, mInt) => {
        if (value === '') return true;
        const numericValue = valueType === 'real' ? parseFloat(value) : parseInt(value);
        if (isNaN(numericValue)) return false;
        if (maxValue !== null && numericValue > maxValue) return false;
        if (minValue !== null && numericValue < minValue) return false;
        return valueType === 'real' ? mReal(value) : mInt(value);
    }

    const realMatch = (value) => {
        if (typeof value !== 'string') return false;
        const match = value.match(/^-?\d*\.?\d*$/);
        return match && match[0] === value;
    }

    const intMatch = (value) => {
        if (typeof value !== 'string') return false;
        const match = value.match(/^-?\d*$/);
        return match && match[0] === value;
    }

    const onChangeText = (value) => {
        let legal = isLegalValue(value, realMatch, intMatch)
        if (legal) {
            setLastValid(value)
        }
        if (legal || validateOnBlur) {
            setStringValue(value)
            let parsedValue = valueType === 'real' ? parseFloat(value) : parseInt(value)
            parsedValue = isNaN(parsedValue) ? 0 : parsedValue
            setInternalValue(parsedValue)
            onChange && onChange(parsedValue)
        }
    }

    const onBlurCustom = () => {
        let legal = isLegalValue(stringValue, realMatch, intMatch);
        if (!legal) {
            if (minValue !== null && parseFloat(stringValue) < minValue) {
                onLimitReached(false, 'Reached Minimum Value!')
                setStringValue(minValue.toString())
                setInternalValue(minValue)
                onChange && onChange(minValue)
            } else if (maxValue !== null && parseFloat(stringValue) > maxValue) {
                onLimitReached(true, 'Reached Maximum Value!')
                setStringValue(maxValue.toString())
                setInternalValue(maxValue)
                onChange && onChange(maxValue)
            } else {
                setStringValue(lastValid.toString())
                setInternalValue(lastValid)
                onChange && onChange(lastValid)
            }
        }
        onBlur && onBlur()
    }

    const onFocusCustom = () => {
        setLastValid(internalValue)
        onFocus && onFocus()
    }

    totalHeight = totalHeight || totalWidth * 0.4
    const inputWidth = type === 'up-down' ? totalWidth * 0.6 : totalWidth * 0.4
    const borderRadiusTotal = totalHeight * 0.18
    const fontSize = totalHeight * 0.38
    const maxReached = internalValue === maxValue
    const minReached = internalValue === minValue

    const inputContainerStyle = type === 'up-down'
        ? [styles.inputContainerUpDown, { width: totalWidth, height: totalHeight, borderColor: borderColor }, rounded ? { borderRadius: borderRadiusTotal } : {}, containerStyle]
        : [styles.inputContainerPlusMinus, { width: totalWidth, height: totalHeight, borderColor: borderColor }, rounded ? { borderRadius: borderRadiusTotal } : {}, containerStyle]

    const calculatedInputStyle = type === 'up-down'
        ? [styles.inputUpDown, { width: inputWidth, height: totalHeight, fontSize: fontSize, color: textColor, borderRightWidth: 2, borderRightColor: borderColor }, inputStyle]
        : [styles.inputPlusMinus, { width: inputWidth, height: totalHeight, fontSize: fontSize, color: textColor, borderRightWidth: separatorWidth, borderLeftWidth: separatorWidth, borderLeftColor: borderColor, borderRightColor: borderColor }, inputStyle]

    const upDownStyle = [{ alignItems: 'center', width: totalWidth - inputWidth, backgroundColor: upDownButtonsBackgroundColor, borderRightWidth: 1, borderRightColor: borderColor }, rounded ? { borderTopRightRadius: borderRadiusTotal, borderBottomRightRadius: borderRadiusTotal } : {}]

    const rightButtonStyle = [{
        position: 'absolute',
        zIndex: -1,
        right: 0,
        height: totalHeight - 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        backgroundColor: rightButtonBackgroundColor,
        width: (totalWidth - inputWidth) / 2
    }, rounded ? { borderTopRightRadius: borderRadiusTotal, borderBottomRightRadius: borderRadiusTotal } : {}]

    const leftButtonStyle = [{
        position: 'absolute',
        zIndex: -1,
        left: 0,
        height: totalHeight - 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: leftButtonBackgroundColor,
        width: (totalWidth - inputWidth) / 2,
        borderWidth: 0
    }, rounded ? { borderTopLeftRadius: borderRadiusTotal, borderBottomLeftRadius: borderRadiusTotal } : {}]

    const inputWraperStyle = {
        alignSelf: 'center',
        borderLeftColor: borderColor,
        borderLeftWidth: separatorWidth,
        borderRightWidth: separatorWidth,
        borderRightColor: borderColor
    }

    if (type === 'up-down') {
        return (
            <View style={inputContainerStyle}>
                <TextInput
                    {...extraTextInputProps}
                    editable={editable}
                    returnKeyType='done'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    keyboardType='numeric'
                    value={stringValue}
                    onChangeText={onChangeText}
                    style={calculatedInputStyle}
                    ref={inputRef}
                    onBlur={onBlurCustom}
                    onFocus={onFocusCustom}
                />
                <View style={upDownStyle}>
                    <Button onPress={inc} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <Icon name='ios-arrow-up' size={fontSize} style={[styles.icon, iconStyle, maxReached ? reachMaxIncIconStyle : {}, minReached ? reachMinIncIconStyle : {}]} />
                    </Button>
                    <Button onPress={dec} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <Icon name='ios-arrow-down' size={fontSize} style={[styles.icon, iconStyle, maxReached ? reachMaxDecIconStyle : {}, minReached ? reachMinDecIconStyle : {}]} />
                    </Button>
                </View>
            </View>
        )
    } else {
        return (
            <View style={inputContainerStyle}>
                <Button onPress={dec} style={leftButtonStyle}>
                    <Icon name='remove' size={fontSize} style={[styles.icon, iconStyle, maxReached ? reachMaxDecIconStyle : {}, minReached ? reachMinDecIconStyle : {}]} />
                </Button>
                <View style={inputWraperStyle}>
                    <TextInput
                        {...extraTextInputProps}
                        editable={editable}
                        returnKeyType='done'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        keyboardType='numeric'
                        value={stringValue}
                        onChangeText={onChangeText}
                        style={calculatedInputStyle}
                        ref={inputRef}
                        onBlur={onBlurCustom}
                        onFocus={onFocusCustom}
                    />
                </View>
                <Button onPress={inc} style={rightButtonStyle}>
                    <Icon name='add' size={fontSize} style={[styles.icon, iconStyle, maxReached ? reachMaxIncIconStyle : {}, minReached ? reachMinIncIconStyle : {}]} />
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        fontWeight: '900',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    inputContainerUpDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'grey',
        borderWidth: 1
    },
    inputContainerPlusMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    inputUpDown: {
        textAlign: 'center',
        padding: 0
    },
    inputPlusMinus: {
        textAlign: 'center',
        padding: 0
    },
    seprator: {
        backgroundColor: 'grey',
        height: calcSize(80),
    },
    upDown: {
        alignItems: 'center',
        paddingRight: calcSize(15)
    }
})

export default NumericInput
