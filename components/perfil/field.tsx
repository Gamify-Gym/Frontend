// Field.tsx
import { View, StyleSheet, TextInput } from "react-native";
import { Text } from "../general";
import colors from "../general/Colors";
import { useState } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  isEditing?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Field({
  label,
  value,
  onChangeText,
  isEditing = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      {isEditing ? (
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            !isEditing && styles.disabledInput,
            isFocused && styles.focusedInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={isEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <View style={styles.textDisplayContainer}>
          <Text style={styles.textDisplay}>
            {value || <Text style={styles.placeholderText}>{placeholder}</Text>}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderOnWhite,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 52,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  focusedInput: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  disabledInput: {
    backgroundColor: colors.surface,
    color: colors.textDisabled,
    borderColor: colors.lightGray,
  },
  textDisplayContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    minHeight: 52,
    justifyContent: "center",
  },
  textDisplay: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  placeholderText: {
    color: colors.textDisabled,
    fontStyle: "italic",
  },
});
