import React, { useState } from 'react';
import {
  Card,
  Text,
  Stack,
  Thumbnail,
  Banner,
  LegacyStack,
  Caption,
  ButtonGroup,
  Button,
  Badge,
  Divider,
} from '@shopify/polaris';

// Predefined BNPL provider logos library
const PREDEFINED_LOGOS = [
  {
    id: 'affirm',
    name: 'Affirm',
    url: '/logos/affirm-logo.svg',
    description: 'Buy now, pay over time with Affirm',
    category: 'Popular',
    recommended: true,
  },
  {
    id: 'klarna',
    name: 'Klarna',
    url: '/logos/klarna-logo.svg',
    description: 'Shop now, pay later with Klarna',
    category: 'Popular',
    recommended: true,
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    url: '/logos/afterpay-logo.svg',
    description: 'Buy now, pay in 4 with Afterpay',
    category: 'Popular',
    recommended: false,
  },
  {
    id: 'sezzle',
    name: 'Sezzle',
    url: '/logos/sezzle-logo.svg',
    description: 'Interest-free payments with Sezzle',
    category: 'Emerging',
    recommended: false,
  },
  {
    id: 'zip',
    name: 'Zip (Quadpay)',
    url: '/logos/zip-logo.svg',
    description: 'Buy now, pay later with Zip',
    category: 'Growing',
    recommended: false,
  },
  {
    id: 'paypal-credit',
    name: 'PayPal Credit',
    url: '/logos/paypal-credit-logo.svg',
    description: 'PayPal Pay in 4',
    category: 'Established',
    recommended: true,
  },
  {
    id: 'generic-bnpl',
    name: 'Generic BNPL',
    url: '/logos/generic-bnpl-logo.svg',
    description: 'Generic Buy Now, Pay Later logo',
    category: 'Generic',
    recommended: false,
  },
];

function PredefinedLogoSelector({ value, onChange, label = "Select Provider Logo" }) {
  const [selectedLogo, setSelectedLogo] = useState(value || null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Popular', 'Recommended', 'Emerging', 'Growing', 'Established', 'Generic'];

  const handleLogoSelect = (logo) => {
    setSelectedLogo(logo);
    if (onChange) {
      onChange(logo);
    }
  };

  const handleClearSelection = () => {
    setSelectedLogo(null);
    if (onChange) {
      onChange(null);
    }
  };

  const filteredLogos = PREDEFINED_LOGOS.filter(logo => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Recommended') return logo.recommended;
    return logo.category === filterCategory;
  });

  return (
    <Card>
      <div style={{ padding: '20px' }}>
        <LegacyStack vertical spacing="loose">
          <div>
            <Text variant="headingMd" as="h3">
              {label}
            </Text>
            <Caption>
              Choose from our library of BNPL provider logos
            </Caption>
          </div>

          {/* Filter Controls */}
          <div>
            <Text variant="headingSm" as="h4" color="subdued">
              Filter by Category
            </Text>
            <div style={{ marginTop: '8px' }}>
              <ButtonGroup segmented>
                {categories.map(category => (
                  <Button
                    key={category}
                    pressed={filterCategory === category}
                    onClick={() => setFilterCategory(category)}
                    size="slim"
                  >
                    {category}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>

          <Divider />

          {/* Selected Logo Display */}
          {selectedLogo && (
            <div>
              <Banner status="success" title="Logo Selected">
                <LegacyStack vertical spacing="tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Thumbnail
                      size="small"
                      alt={selectedLogo.name}
                      source={selectedLogo.url}
                    />
                    <div>
                      <Text variant="bodySm" as="p" fontWeight="semibold">
                        {selectedLogo.name}
                      </Text>
                      <Caption>{selectedLogo.description}</Caption>
                    </div>
                  </div>
                  <Button size="slim" onClick={handleClearSelection}>
                    Clear Selection
                  </Button>
                </LegacyStack>
              </Banner>
            </div>
          )}

          {/* Logo Library Grid */}
          <div>
            <Text variant="headingSm" as="h4" color="subdued">
              Available Logos ({filteredLogos.length})
            </Text>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px',
              marginTop: '12px'
            }}>
              {filteredLogos.map(logo => (
                <Card 
                  key={logo.id}
                  sectioned
                  subdued={selectedLogo?.id === logo.id}
                >
                  <div 
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px',
                      border: selectedLogo?.id === logo.id ? '2px solid #00848e' : '2px solid transparent',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleLogoSelect(logo)}
                  >
                    <LegacyStack vertical spacing="tight" alignment="center">
                      <div style={{ 
                        width: '120px', 
                        height: '40px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f6f6f7',
                        borderRadius: '4px',
                        padding: '8px'
                      }}>
                        <Thumbnail
                          size="medium"
                          alt={logo.name}
                          source={logo.url}
                        />
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                          <Text variant="bodySm" as="p" fontWeight="semibold">
                            {logo.name}
                          </Text>
                          {logo.recommended && (
                            <Badge status="success">Recommended</Badge>
                          )}
                        </div>
                        <Caption>{logo.category}</Caption>
                        <Caption>{logo.description}</Caption>
                      </div>
                      
                      {selectedLogo?.id === logo.id && (
                        <div style={{ marginTop: '8px' }}>
                          <Badge status="info">Selected</Badge>
                        </div>
                      )}
                    </LegacyStack>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {filteredLogos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text variant="bodySm" as="p" color="subdued">
                No logos found in the "{filterCategory}" category.
              </Text>
            </div>
          )}

          <Divider />

          <div>
            <Caption>
              All logos are optimized for web display and BNPL widget integration. 
              Need a custom logo? Contact support for assistance.
            </Caption>
          </div>
        </LegacyStack>
      </div>
    </Card>
  );
}

export default PredefinedLogoSelector; 