import React, { useState } from "react";
import {
  reactExtension,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => <Extension />);

function Extension() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldKey = "isgift";

  // Get a reference to the metafield
  const isgift = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
      applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: metafieldKey,
        valueType: "string",
        value: "TRUE --- add SKU:'Overbox'",
      }).then((response) => {
        console.log('Metafield update response:', response);
        console.log('Metafield updated successfully');
      }).catch((error) => {
        console.error('Error updating metafield:', error);
      });

  };
  // Render the extension components
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
       Is this a gift?
      </Checkbox>
    </BlockStack>
  );
}