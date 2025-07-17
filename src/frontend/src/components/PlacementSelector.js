import React, { useState } from 'react';
import {
  Card,
  Text,
  RadioButton,
  BlockStack,
  Badge,
  Banner,
  Button,
  Icon,
  Tooltip,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import { ViewMajor, CircleInformationMajor } from '@shopify/polaris-icons';

function PlacementSelector({ 
  value = 'product_page_bottom', 
  onChange, 
  label = "Widget Placement",
  disabled = false 
}) {
  const [selectedPlacement, setSelectedPlacement] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlacement, setPreviewPlacement] = useState(null);

  const placementOptions = {
    product_page_top: {
      name: 'Product Page - Top',
      description: 'Above product images and title',
      impact: 'High visibility, first thing customers see',
      badge: 'Recommended',
      badgeStatus: 'success',
      preview: 'Shows at the very top of the product page, above the product image gallery'
    },
    product_page_bottom: {
      name: 'Product Page - Bottom',
      description: 'Below product description and reviews',
      impact: 'Good visibility after product information',
      badge: 'Popular',
      badgeStatus: 'info',
      preview: 'Appears at the bottom of the product page, after description and reviews'
    },
    add_to_cart_button: {
      name: 'Near Add to Cart',
      description: 'Next to or below the add to cart button',
      impact: 'High conversion impact at point of purchase',
      badge: 'High Converting',
      badgeStatus: 'warning',
      preview: 'Positioned right next to the add to cart button for maximum purchase intent'
    },
    product_tabs: {
      name: 'Product Tabs',
      description: 'As a separate tab in product information',
      impact: 'Organized display with other product details',
      badge: 'Clean',
      badgeStatus: 'subdued',
      preview: 'Creates a dedicated tab for BADGR information alongside other product tabs'
    },
    sidebar: {
      name: 'Sidebar',
      description: 'In the product page sidebar',
      impact: 'Always visible without scrolling',
      badge: 'Sticky',
      badgeStatus: 'info',
      preview: 'Fixed position in the sidebar, stays visible as customers scroll'
    },
    floating: {
      name: 'Floating Widget',
      description: 'Floating overlay on the page',
      impact: 'Maximum attention but potentially intrusive',
      badge: 'Attention',
      badgeStatus: 'critical',
      preview: 'Overlays the page content with a floating, dismissible widget'
    }
  };

  const handlePlacementChange = (placement) => {
    setSelectedPlacement(placement);
    if (onChange) {
      onChange(placement);
    }
  };

  const handlePreview = (placement) => {
    setPreviewPlacement(placement);
    setShowPreview(true);
  };

  const PlacementPreview = ({ placement }) => {
    const option = placementOptions[placement];
    if (!option) return null;

    return (
      <div style={{ 
        border: '2px solid #e1e3e5',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f6f6f7',
        minHeight: '200px',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '12px',
          color: '#6d7175'
        }}>
          Preview
        </div>
        
        <div style={{ 
          border: '1px solid #c9cccf',
          borderRadius: '4px',
          padding: '12px',
          backgroundColor: 'white',
          marginBottom: '12px'
        }}>
          <Text variant="headingSm" as="h4">
            Product Page Layout
          </Text>
        </div>
        
        {placement === 'product_page_top' && (
          <div style={{ 
            backgroundColor: '#00a047',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            BADGR Widget Here
          </div>
        )}
        
        <div style={{ 
          border: '1px solid #c9cccf',
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: 'white',
          marginBottom: '8px'
        }}>
          Product Images & Info
        </div>
        
        {placement === 'add_to_cart_button' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ 
              backgroundColor: '#008060',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px'
            }}>
              Add to Cart
            </div>
            <div style={{ 
              backgroundColor: '#00a047',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              BADGR
            </div>
          </div>
        )}
        
        <div style={{ 
          border: '1px solid #c9cccf',
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: 'white',
          marginBottom: '8px'
        }}>
          Product Description
        </div>
        
        {placement === 'product_tabs' && (
          <div style={{ 
            border: '1px solid #c9cccf',
            borderRadius: '4px',
            padding: '8px',
            backgroundColor: 'white',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '4px 8px', backgroundColor: '#f6f6f7', borderRadius: '4px' }}>
                Description
              </div>
              <div style={{ padding: '4px 8px', backgroundColor: '#00a047', color: 'white', borderRadius: '4px' }}>
                BADGR
              </div>
              <div style={{ padding: '4px 8px', backgroundColor: '#f6f6f7', borderRadius: '4px' }}>
                Reviews
              </div>
            </div>
          </div>
        )}
        
        {placement === 'product_page_bottom' && (
          <div style={{ 
            backgroundColor: '#00a047',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            BADGR Widget Here
          </div>
        )}
        
        {placement === 'sidebar' && (
          <div style={{ 
            position: 'absolute',
            right: '10px',
            top: '50px',
            backgroundColor: '#00a047',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            width: '60px',
            textAlign: 'center'
          }}>
            BADGR Sidebar
          </div>
        )}
        
        {placement === 'floating' && (
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#00a047',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            textAlign: 'center',
            border: '2px solid white'
          }}>
            Floating BADGR Widget
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <div style={{ padding: '20px' }}>
                  <BlockStack spacing="loose">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text variant="headingMd" as="h3">
              {label}
            </Text>
            <Tooltip content="Choose where your BADGR widget appears on product pages for optimal visibility and conversion">
              <Icon source={CircleInformationMajor} color="subdued" />
            </Tooltip>
          </div>
          
          <Banner status="info">
            <p>Select the optimal placement for your widget to maximize customer engagement and conversion rates.</p>
          </Banner>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
            {Object.entries(placementOptions).map(([key, option]) => (
              <div key={key} style={{ 
                border: selectedPlacement === key ? '2px solid #008060' : '1px solid #e1e3e5',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: selectedPlacement === key ? '#f6f6f7' : 'white',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}>
                                  <BlockStack spacing="tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioButton
                      label={option.name}
                      checked={selectedPlacement === key}
                      id={key}
                      name="placement"
                      onChange={() => handlePlacementChange(key)}
                      disabled={disabled}
                    />
                    <Badge status={option.badgeStatus}>
                      {option.badge}
                    </Badge>
                  </div>
                  
                  <Text variant="bodyMd" as="p" color="subdued">
                    {option.description}
                  </Text>
                  
                  <Text variant="bodySm" as="p">
                    <strong>Impact:</strong> {option.impact}
                  </Text>
                  
                  <Button
                    size="slim"
                    plain
                    icon={ViewMajor}
                    onClick={() => handlePreview(key)}
                    disabled={disabled}
                  >
                    Preview placement
                  </Button>
                </BlockStack>
              </div>
            ))}
          </div>
        </BlockStack>
      </div>
      
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={previewPlacement ? `Preview: ${placementOptions[previewPlacement]?.name}` : 'Preview'}
        primaryAction={{
          content: 'Close',
          onAction: () => setShowPreview(false),
        }}
        secondaryActions={[
          {
            content: 'Select this placement',
            onAction: () => {
              if (previewPlacement) {
                handlePlacementChange(previewPlacement);
              }
              setShowPreview(false);
            },
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <Text variant="bodyMd" as="p">
              {previewPlacement ? placementOptions[previewPlacement]?.preview : ''}
            </Text>
            <div style={{ marginTop: '16px' }}>
              {previewPlacement && <PlacementPreview placement={previewPlacement} />}
            </div>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </Card>
  );
}

export default PlacementSelector; 