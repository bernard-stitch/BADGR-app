import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Checkbox,
  BlockStack,
  Badge,
  Banner,
  Button,
  Icon,
  Tooltip,
} from '@shopify/polaris';
import { CircleInformationMajor } from '@shopify/polaris-icons';

function BNPLOptionsToggle({ 
  value = {}, 
  onChange, 
  label = "Buy Now Pay Later Options",
  disabled = false 
}) {
  const [bnplOptions, setBnplOptions] = useState({
    enabled: false,
    providers: {
      affirm: false,
      klarna: false,
      afterpay: false,
      sezzle: false,
      zip: false,
    },
    ...value
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(bnplOptions);
    }
  }, [bnplOptions, onChange]);

  const handleMainToggle = (checked) => {
    setBnplOptions(prev => ({
      ...prev,
      enabled: checked,
      // If disabling, also disable all providers
      providers: checked ? prev.providers : {
        affirm: false,
        klarna: false,
        afterpay: false,
        sezzle: false,
        zip: false,
      }
    }));
  };

  const handleProviderToggle = (provider, checked) => {
    setBnplOptions(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: checked
      }
    }));
  };

  const enabledProvidersCount = Object.values(bnplOptions.providers).filter(Boolean).length;

  const providerInfo = {
    affirm: {
      name: 'Affirm',
      description: 'Split purchases into monthly payments',
      color: 'blue'
    },
    klarna: {
      name: 'Klarna',
      description: 'Pay in 4 installments or monthly payments',
      color: 'pink'
    },
    afterpay: {
      name: 'Afterpay',
      description: 'Buy now, pay in 4 installments',
      color: 'green'
    },
    sezzle: {
      name: 'Sezzle',
      description: 'Split payments into 4 interest-free installments',
      color: 'purple'
    },
    zip: {
      name: 'Zip (Quadpay)',
      description: 'Pay in 4 installments over 6 weeks',
      color: 'yellow'
    }
  };

  return (
    <Card>
      <div style={{ padding: '20px' }}>
                  <BlockStack spacing="loose">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text variant="headingMd" as="h3">
              {label}
            </Text>
            <Tooltip content="Display Buy Now Pay Later options in your widget to increase conversion rates">
              <Icon source={CircleInformationMajor} color="subdued" />
            </Tooltip>
          </div>
          
          <Checkbox
            label="Enable Buy Now Pay Later options"
            checked={bnplOptions.enabled}
            onChange={handleMainToggle}
            disabled={disabled}
            helpText="Show payment options to customers during checkout"
          />
          
          {bnplOptions.enabled && (
            <div style={{ marginLeft: '24px' }}>
              <BlockStack spacing="tight">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text variant="headingSm" as="h4">
                    Payment Providers
                  </Text>
                  {enabledProvidersCount > 0 && (
                    <Badge status="success">
                      {enabledProvidersCount} enabled
                    </Badge>
                  )}
                </div>
                
                {enabledProvidersCount === 0 && (
                  <Banner status="warning">
                    <p>Select at least one payment provider to display BNPL options</p>
                  </Banner>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {Object.entries(providerInfo).map(([key, info]) => (
                    <div key={key} style={{ 
                      border: '1px solid #e1e3e5',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: bnplOptions.providers[key] ? '#f6f6f7' : 'white'
                    }}>
                      <Checkbox
                        label={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text variant="bodyMd" as="span">
                              {info.name}
                            </Text>
                            <Badge status={info.color}>{info.name}</Badge>
                          </div>
                        }
                        checked={bnplOptions.providers[key]}
                        onChange={(checked) => handleProviderToggle(key, checked)}
                        disabled={disabled}
                        helpText={info.description}
                      />
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '16px' }}>
                  <Button
                    plain
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                  </Button>
                </div>
                
                {showAdvanced && (
                  <div style={{ 
                    marginTop: '16px',
                    padding: '16px',
                    border: '1px solid #e1e3e5',
                    borderRadius: '8px',
                    backgroundColor: '#fafbfb'
                  }}>
                    <BlockStack spacing="tight">
                      <Text variant="headingSm" as="h4">
                        Advanced BNPL Settings
                      </Text>
                      
                      <Checkbox
                        label="Show provider logos"
                        checked={bnplOptions.showLogos !== false}
                        onChange={(checked) => setBnplOptions(prev => ({
                          ...prev,
                          showLogos: checked
                        }))}
                        disabled={disabled}
                        helpText="Display payment provider logos alongside options"
                      />
                      
                      <Checkbox
                        label="Show payment breakdown"
                        checked={bnplOptions.showBreakdown !== false}
                        onChange={(checked) => setBnplOptions(prev => ({
                          ...prev,
                          showBreakdown: checked
                        }))}
                        disabled={disabled}
                        helpText="Show customers how much they'll pay per installment"
                      />
                      
                      <Checkbox
                        label="Enable for all products"
                        checked={bnplOptions.allProducts !== false}
                        onChange={(checked) => setBnplOptions(prev => ({
                          ...prev,
                          allProducts: checked
                        }))}
                        disabled={disabled}
                        helpText="Display BNPL options on all products, not just those above minimum amount"
                      />
                    </BlockStack>
                  </div>
                )}
              </BlockStack>
            </div>
          )}
        </BlockStack>
      </div>
    </Card>
  );
}

export default BNPLOptionsToggle; 