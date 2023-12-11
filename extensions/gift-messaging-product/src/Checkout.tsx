import {
  useApi,
  reactExtension,
  InlineLayout,
  Text,
  Checkbox,
  Image,
  BlockStack,
  Pressable,
  Heading,
  BlockSpacer,
  Divider,
  useCartLines,
  useApplyCartLinesChange,
  useSettings,
  TextField

} from '@shopify/ui-extensions-react/checkout';

import { title } from 'process';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

interface VariantData {
  title: string;
  price: {
    amount: string;
    currencyCode: String;
  }
  image?: {
    url: String;
    altText: String;
  }
  product: {
    title: string;
    featuredImage?:{
      url: String;
      altText: String;
    }
  }
}

function Extension() {
  const { query } = useApi();

  const [variantData, setVariant] = useState<null | VariantData>(null)
  const [isSelected, setIsSelected] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [giftMessage, setGiftMessage] = useState('');


  const cartLines = useCartLines();
  const applyCartLineChange = useApplyCartLinesChange();

  const settings = useSettings();
  const variantId = settings.selected_variant as string;

  useEffect(() => {
    async function getVariantData(){
      const queryResult = await query<{node: VariantData}>(`{
        node(id: "${variantId}"){
          ... on ProductVariant {
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }`);

      if (queryResult.data) {
        setVariant(queryResult.data.node)
      }
    }
    if(variantId) {
      getVariantData();
    }
  }, []);

  const customAttributes = [
    { key: 'Gift Message', value: giftMessage }
  ];  

  useEffect(() => {
    if(isSelected && giftMessage) {
      applyCartLineChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: variantId,
        attributes: customAttributes
      });
    } else {
      const cartLineId = cartLines.find(
        cartLine => cartLine.merchandise.id === variantId
      )?.id;
  
      if(cartLineId) {
        applyCartLineChange({
          type: "removeCartLine",
          quantity: 1,
          id: cartLineId
        });
      }
    }
  }, [isSelected, giftMessage]);
  

  if(!variantData) return null;

  return (
    <>
    <Divider/>
    <BlockSpacer
    spacing={"base"}/>
    <Heading level={2}>
      {settings.gift_messaging_title}
    </Heading>
    <BlockSpacer
    spacing={"base"}/>
        <TextField
          label={`Gift message (${300 - charCount} characters left)`}
          multiline={3}
          maxLength={300}
          onChange={(newMessage) => setGiftMessage(newMessage)}
          onInput={(value) => {
            setCharCount(value.length);
          }}
          value={giftMessage}
        />
    <Pressable
      onPress={() => setIsSelected(!isSelected) }
    >
    <InlineLayout blockAlignment="center" spacing={["base", "base"]} columns={["auto", 80, "fill"]} padding="base"
    >
      <Checkbox
      checked={isSelected}
      />
      <Image
      source={variantData.image?.url || variantData.product.featuredImage?.url}
      accessibilityDescription={variantData.image?.url || variantData.product.featuredImage?.altText}
      borderRadius={"base"}
      border={"base"}
      borderWidth={"base"}
      />
      <BlockStack spacing={"base"}>
        <Text>
          {variantData.product.title} - {variantData.title}
        </Text>
        <Text>
          ${parseFloat(variantData.price.amount).toFixed(2)}
        </Text>
        <Text size="small">
          {settings.gift_messaging_description}
        </Text>
      </BlockStack>
    </InlineLayout>
    </Pressable>
    </>
  );
}