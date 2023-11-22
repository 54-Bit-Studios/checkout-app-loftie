// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {


  const kidsClockTotalQuantity = input.cart.lines
  .filter(line => line.merchandise.__typename === "ProductVariant" &&
                  line.merchandise.product.id === "gid://shopify/Product/6806537437248")
  .reduce((sum, line) => sum + line.quantity, 0);

  const targets = input.cart.lines
  .filter(line => line.merchandise.__typename == "ProductVariant" && line.merchandise.product.id == "gid://shopify/Product/6806537470016" && line.attribute?.value === "Kids Stickers")
  .map(line => {
    console.log("LINE", JSON.stringify(line));
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    return /** @type {Target} */ ({
      // Use the variant ID to create a discount target
      productVariant: {
        id: variant.id,
        quantity: kidsClockTotalQuantity
      }
    });
  });

  console.log("kidsClockCount", kidsClockTotalQuantity)

  if (!targets.length || kidsClockTotalQuantity === 0) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  const limitedTargets = targets.slice(0, kidsClockTotalQuantity);

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  console.log("FOUND TARGETS", limitedTargets)
  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets: limitedTargets,
        // Define a percentage-based discount
        value: {
          percentage: {
            value: "100.0"
          }
        }, message: "Free stickers"
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First
  };
};
