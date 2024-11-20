import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const NumericInput = ({
  borderColor = '#E5E7E9',
  containerStyle = {},
  editable = true,
  initValue = 0,
  inputStyle = {},
  maxValue = null,
  minValue = null,
  onChange,
  onLimitReached = () => {},
  rounded = false,
  step = 1,
  textColor = '#000',
  totalHeight = 50,
  totalWidth = 150,
  type = 'plus-minus',
  value = null,
}) => {
  const [internalValue, setInternalValue] = useState(
    initValue !== 0 || initValue ? initValue : value || 0
  );
  const [stringValue, setStringValue] = useState(
    (initValue !== 0 || initValue ? initValue : value || 0).toString()
  );

  useEffect(() => {
    if (value !== null && value !== internalValue) {
      setInternalValue(value);
      setStringValue(value.toString());
    }
  }, [value]);

  const buttonWidth = totalWidth * 0.3;
  const inputWidth = totalWidth * 0.4;
  const borderRadius = rounded ? 10 : 0;

  const handleIncrement = () => {
    const newValue = internalValue + step;
    if (maxValue === null || newValue <= maxValue) {
      setInternalValue(newValue);
      setStringValue(newValue.toString());
      onChange?.(newValue);
    } else {
      onLimitReached(true, 'Reached Maximum Value!');
    }
  };

  const handleDecrement = () => {
    const newValue = internalValue - step;
    if (minValue === null || newValue >= minValue) {
      setInternalValue(newValue);
      setStringValue(newValue.toString());
      onChange?.(newValue);
    } else {
      onLimitReached(false, 'Reached Minimum Value!');
    }
  };

  const handleChangeText = (text) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      if (
        (maxValue === null || numericValue <= maxValue) &&
        (minValue === null || numericValue >= minValue)
      ) {
        setInternalValue(numericValue);
        setStringValue(text);
        onChange?.(numericValue);
      }
    } else if (text === '') {
      setStringValue('');
    }
  };

  const handleBlur = () => {
    if (stringValue === '') {
      const defaultValue = minValue !== null ? minValue : 0;
      setInternalValue(defaultValue);
      setStringValue(defaultValue.toString());
      onChange?.(defaultValue);
    }
  };

  const renderPlusMinusType = () => (
    <View style={[styles.containerPlusMinus, { width: totalWidth }, containerStyle]}>
      <Pressable
        onPress={handleDecrement}
        style={({ pressed }) => [
          styles.button,
          { width: buttonWidth, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>-</Text>
      </Pressable>
      <TextInput
        editable={editable}
        keyboardType="numeric"
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        returnKeyType="done"
        style={[
          styles.input,
          {
            width: inputWidth,
            color: textColor,
            borderColor: borderColor,
          },
          inputStyle,
        ]}
        value={stringValue}
      />
      <Pressable
        onPress={handleIncrement}
        style={({ pressed }) => [
          styles.button,
          { width: buttonWidth, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );

  const renderUpDownType = () => (
    <View style={[styles.containerUpDown, { width: totalWidth }, containerStyle]}>
      <TextInput
        editable={editable}
        keyboardType="numeric"
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        returnKeyType="done"
        style={[
          styles.input,
          {
            width: totalWidth * 0.7,
            color: textColor,
            borderColor: borderColor,
          },
          inputStyle,
        ]}
        value={stringValue}
      />
      <View style={styles.upDownButtons}>
        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [
            styles.upDownButton,
            { borderBottomWidth: 0.5 },
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>▲</Text>
        </Pressable>
        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [
            styles.upDownButton,
            { borderTopWidth: 0.5 },
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>▼</Text>
        </Pressable>
      </View>
    </View>
  );

  return type === 'plus-minus' ? renderPlusMinusType() : renderUpDownType();
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#09447A',
    height: '100%',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: "MBold",
    fontSize: 18,
  },
  containerPlusMinus: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  containerUpDown: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  input: {
    borderColor: '#E5E7E9',
    borderWidth: 1,
    fontFamily: "MRegular",
    fontSize: 16,
    height: '100%',
    textAlign: 'center',
  },
  upDownButton: {
    alignItems: 'center',
    backgroundColor: '#F7CB41',
    borderColor: '#E5E7E9',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  upDownButtons: {
    borderColor: '#E5E7E9',
    borderWidth: 1,
    flex: 1,
    height: '100%',
  },
});

export default NumericInput;
