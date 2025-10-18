// Field.tsx
import { View, StyleSheet, TextInput } from "react-native";
import { Text } from "../general";
import colors from "../general/Colors";

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
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      {isEditing ? (
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            !isEditing && styles.disabledInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={isEditing}
        />
      ) : (
        <Text style={styles.textDisplay}>
          {value || <Text style={styles.placeholderText}>{placeholder}</Text>}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderOnWhite,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  disabledInput: {
    backgroundColor: colors.lightGray,
    color: colors.textDisabled,
  },
  textDisplay: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 48,
    lineHeight: 24,
  },
  placeholderText: {
    color: colors.textDisabled,
    fontStyle: "italic",
  },
});
