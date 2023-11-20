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
  useSettings

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

  useEffect(() => {
    if(isSelected) {
      applyCartLineChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: variantId
      })
    } else {
      const cartLineId = cartLines.find(
        cartLine => cartLine.merchandise.id === variantId
      )?.id

      if(cartLineId) {
        applyCartLineChange({
          type: "removeCartLine",
          quantity: 1,
          id: cartLineId
        })
      }
    }
  }, [isSelected])

  if(!variantData) return null;

  return (
    <>
    <Divider/>
    <BlockSpacer
    spacing={"base"}/>
    <Heading level={2}>
      {settings.shipping_insurance_title}
    </Heading>
    <BlockSpacer
    spacing={"base"}/>
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
          ${variantData.price.amount}
        </Text>
        <Text size="small">
          {settings.shipping_insurance_description}
        </Text>
      </BlockStack>
    </InlineLayout>
    </Pressable>
    </>
  );
}