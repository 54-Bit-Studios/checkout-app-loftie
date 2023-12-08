import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  useSettings
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // Define the metafield namespace and key
  const metafieldNamespace = "checkout";
  const metafieldKey = "gift_messaging";
  const settings = useSettings();
  const header = settings.gift_messaging_header ?? 'Would you like to add a gift message?';
  const label = settings.gift_messaging_label ?? 'Gift message';

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };
  // Render the extension components
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
       {header}
      </Checkbox>
      {checked && (
        <TextField
          label={label}
          multiline={3}
          maxLength={250}
          onChange={(value) => {
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
}
