import {     
    TextBlock,
    BlockStack,
    Heading,
    InlineLayout,
    Icon,
    Divider,
    useSettings,
    reactExtension,
    InlineStack,
    BlockLayout
    } from '@shopify/ui-extensions-react/checkout';

    export default reactExtension(
      'purchase.checkout.block.render',
      () => <Extension />,
    );

function Extension() {
    const{icon_title_1, icon_title_2, icon_title_3, icon_1, icon_2, icon_3} = useSettings();

    return(
        <InlineLayout spacing='base' columns={['33.3%', '33.3%', '33.3%']}>
            <BlockLayout blockAlignment='center' inlineAlignment='center'>
                <Icon source={icon_1} size='base' appearance="subdued"/>
                <Heading level={2} inlineAlignment='center'>{icon_title_1}</Heading>
            </BlockLayout>
            <BlockLayout  blockAlignment='center' inlineAlignment='center'>
                <Icon source={icon_2} size='base'  appearance="subdued"/>
                <Heading level={2} inlineAlignment='center'>{icon_title_2}</Heading>
            </BlockLayout>
            <BlockLayout blockAlignment='center' inlineAlignment='center'>
                <Icon source={icon_3} size='base'  appearance="subdued"/>
                <Heading level={2} inlineAlignment='center'>{icon_title_3}</Heading>
            </BlockLayout>
        </InlineLayout>
    )
};