import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  TextField,
  Select,
  Checkbox,
  FormLayout,
  Banner,
  Toast,
  Frame,
  Spinner,
  Badge,
  BlockStack,
  Divider,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

// Import our new components
import PredefinedLogoSelector from '../components/PredefinedLogoSelector';
import BNPLOptionsToggle from '../components/BNPLOptionsToggle';
import PlacementSelector from '../components/PlacementSelector';

function WidgetSettings() {
  const navigate = useNavigate();
  
  // Main widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    // Basic settings
    shopDomain: '',
    widgetTitle: 'BADGR Widget',
    isEnabled: true,
    customCSS: '',
    
    // Logo configuration
    logo: {
      selectedLogo: null, // Will store the predefined logo object
    },
    
    // BNPL configuration
    bnplOptions: {
      enabled: false,
      providers: {
        affirm: false,
        klarna: false,
        afterpay: false,
        sezzle: false,
        zip: false,
      },
      showLogos: true,
      showBreakdown: true,
      allProducts: false,
    },
    
    // Placement configuration
    placement: 'product_page_bottom',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing configuration on component mount
  useEffect(() => {
    loadWidgetConfiguration();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [widgetConfig]);

  const loadWidgetConfiguration = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load existing configuration
      // In real app, this would fetch from backend
      const response = await fetch('/api/widgets/current-config');
      if (response.ok) {
        const config = await response.json();
        setWidgetConfig(prevConfig => ({
          ...prevConfig,
          ...config,
        }));
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToastMessage('Error loading configuration', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicSettingChange = (field, value) => {
    setWidgetConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoChange = (selectedLogo) => {
    setWidgetConfig(prev => ({
      ...prev,
      logo: {
        selectedLogo,
      },
    }));
  };

  const handleBNPLChange = (bnplOptions) => {
    setWidgetConfig(prev => ({
      ...prev,
      bnplOptions,
    }));
  };

  const handlePlacementChange = (placement) => {
    setWidgetConfig(prev => ({
      ...prev,
      placement,
    }));
  };

  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare configuration data for API (no file upload needed with predefined logos)
      const configData = {
        ...widgetConfig,
        // Store the selected logo ID for backend reference
        logo: {
          selectedLogoId: widgetConfig.logo.selectedLogo?.id || null,
          selectedLogoName: widgetConfig.logo.selectedLogo?.name || null,
          selectedLogoUrl: widgetConfig.logo.selectedLogo?.url || null,
        }
      };

      // Simulate API call
      const response = await fetch('/api/widgets/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        showToastMessage('Widget configuration saved successfully!');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      showToastMessage('Error saving configuration. Please try again.', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    loadWidgetConfiguration();
  };

  const getEnabledFeaturesCount = () => {
    let count = 0;
    if (widgetConfig.logo.selectedLogo) count++;
    if (widgetConfig.bnplOptions.enabled) count++;
    if (widgetConfig.customCSS.trim()) count++;
    return count;
  };

  const toastMarkup = showToast ? (
    <Toast
      content={toastMessage}
      error={toastError}
      onDismiss={() => setShowToast(false)}
    />
  ) : null;

  if (isLoading) {
    return (
      <Page title="Widget Settings">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spinner size="large" />
          <Text variant="bodyMd" as="p">
            Loading widget configuration...
          </Text>
        </div>
      </Page>
    );
  }

  return (
    <Frame>
      <Page
        title="Widget Settings"
        subtitle="Configure your BADGR widget appearance and behavior"
        breadcrumbs={[
          { content: 'Dashboard', onAction: () => navigate('/') },
        ]}
        primaryAction={{
          content: 'Save Configuration',
          onAction: handleSave,
          loading: isSaving,
          disabled: !hasUnsavedChanges,
        }}
        secondaryActions={[
          {
            content: 'Reset Changes',
            onAction: handleReset,
            disabled: !hasUnsavedChanges,
          },
        ]}
      >
        <Layout>
          <Layout.Section>
            <Banner
              title={`Widget Configuration ${getEnabledFeaturesCount() > 0 ? `(${getEnabledFeaturesCount()} features enabled)` : ''}`}
              status="info"
            >
              <p>Configure how your BADGR widget appears and behaves on your store.</p>
              {hasUnsavedChanges && (
                <p><strong>You have unsaved changes.</strong> Don't forget to save your configuration.</p>
              )}
            </Banner>
          </Layout.Section>

          {/* Basic Settings */}
          <Layout.Section>
            <Card>
              <div style={{ padding: '20px' }}>
                <BlockStack spacing="loose">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text variant="headingMd" as="h2">
                      Basic Settings
                    </Text>
                    {widgetConfig.isEnabled && (
                      <Badge status="success">Enabled</Badge>
                    )}
                  </div>
                  
                  <FormLayout>
                    <TextField
                      label="Shop Domain"
                      value={widgetConfig.shopDomain}
                      onChange={(value) => handleBasicSettingChange('shopDomain', value)}
                      placeholder="your-shop.myshopify.com"
                      helpText="Enter your Shopify store domain"
                    />
                    
                    <TextField
                      label="Widget Title"
                      value={widgetConfig.widgetTitle}
                      onChange={(value) => handleBasicSettingChange('widgetTitle', value)}
                      helpText="The title displayed on your widget"
                    />
                    
                    <Checkbox
                      label="Enable Widget"
                      checked={widgetConfig.isEnabled}
                      onChange={(checked) => handleBasicSettingChange('isEnabled', checked)}
                      helpText="Turn your widget on or off"
                    />
                  </FormLayout>
                </BlockStack>
              </div>
            </Card>
          </Layout.Section>

          {/* Logo Configuration */}
          <Layout.Section>
            <PredefinedLogoSelector
              value={widgetConfig.logo.selectedLogo}
              onChange={handleLogoChange}
              label="Select BNPL Provider Logo"
            />
          </Layout.Section>

          {/* BNPL Configuration */}
          <Layout.Section>
            <BNPLOptionsToggle
              value={widgetConfig.bnplOptions}
              onChange={handleBNPLChange}
              disabled={!widgetConfig.isEnabled}
            />
          </Layout.Section>

          {/* Placement Configuration */}
          <Layout.Section>
            <PlacementSelector
              value={widgetConfig.placement}
              onChange={handlePlacementChange}
              disabled={!widgetConfig.isEnabled}
            />
          </Layout.Section>

          {/* Advanced Settings */}
          <Layout.Section>
            <Card>
              <div style={{ padding: '20px' }}>
                <BlockStack spacing="loose">
                  <Text variant="headingMd" as="h2">
                    Advanced Settings
                  </Text>
                  
                  <FormLayout>
                    <TextField
                      label="Custom CSS"
                      value={widgetConfig.customCSS}
                      onChange={(value) => handleBasicSettingChange('customCSS', value)}
                      multiline={6}
                      helpText="Add custom CSS to style your widget"
                      placeholder=".badgr-widget { color: #000; background: #fff; }"
                    />
                  </FormLayout>
                  
                  <Divider />
                  
                  <div style={{ marginTop: '16px' }}>
                    <Text variant="headingSm" as="h3">
                      Configuration Summary
                    </Text>
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Badge status={widgetConfig.isEnabled ? 'success' : 'subdued'}>
                        Widget {widgetConfig.isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Badge status={widgetConfig.logo.selectedLogo ? 'success' : 'subdued'}>
                        Logo {widgetConfig.logo.selectedLogo ? `Selected (${widgetConfig.logo.selectedLogo.name})` : 'Not Selected'}
                      </Badge>
                      <Badge status={widgetConfig.bnplOptions.enabled ? 'success' : 'subdued'}>
                        BNPL {widgetConfig.bnplOptions.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Badge status="info">
                        Placement: {widgetConfig.placement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                </BlockStack>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      {toastMarkup}
    </Frame>
  );
}

export default WidgetSettings; 