import {
  Banner,
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
  useApplyCartLinesChange

} from '@shopify/ui-extensions-react/checkout';
import { title } from 'process';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

const variantId = "gid://shopify/ProductVariant/39854280736832";

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
    getVariantData();
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

  console.log(variantData);
  return (
    <>
    <Divider/>
    <BlockSpacer
    spacing={"base"}/>
    <Heading level={2}>
      Protect your order:
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
      <BlockStack>
        <Text>
          {variantData.product.title} - {variantData.title}
        </Text>
        <Text>
          ${variantData.price.amount}
        </Text>
      </BlockStack>
    </InlineLayout>
    </Pressable>
    </>
  );
}