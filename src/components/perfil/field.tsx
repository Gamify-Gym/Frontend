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
    color: "#dfb7ff",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "rgba(43, 11, 79, 0.5)",
    borderWidth: 2,
    borderColor: "rgba(223, 128, 255, 0.3)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    minHeight: 52,
    shadowColor: "#df80ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedInput: {
    borderColor: "#df80ff",
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: "rgba(43, 11, 79, 0.7)",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  disabledInput: {
    backgroundColor: "rgba(27, 16, 49, 0.4)",
    color: "#b8a3c9",
    borderColor: "rgba(223, 128, 255, 0.2)",
  },
  textDisplayContainer: {
    backgroundColor: "rgba(27, 16, 49, 0.4)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.2)",
    minHeight: 52,
    justifyContent: "center",
  },
  textDisplay: {
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  placeholderText: {
    color: "#b8a3c9",
    fontStyle: "italic",
  },
});
