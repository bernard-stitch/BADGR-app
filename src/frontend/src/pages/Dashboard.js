import React from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Badge,
  DataTable,
  Link,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Sample data for the dashboard
  const widgetStats = [
    ['Total Widgets', '5', <Badge status="success">Active</Badge>],
    ['Views Today', '1,234', <Badge status="info">+12%</Badge>],
    ['Click Rate', '3.5%', <Badge status="warning">-2%</Badge>],
    ['Conversion Rate', '2.1%', <Badge status="success">+0.5%</Badge>],
  ];

  return (
    <Page
      title="BADGR Dashboard"
      subtitle="Manage your widget campaigns"
      primaryAction={{
        content: 'Widget Settings',
        onAction: () => navigate('/settings'),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <Text variant="headingMd" as="h2">
                Welcome to BADGR
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Your widget management dashboard. Track performance, manage settings, and optimize your campaigns.
              </Text>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <Text variant="headingMd" as="h3">
                Widget Performance
              </Text>
              <div style={{ marginTop: '16px' }}>
                <DataTable
                  columnContentTypes={['text', 'text', 'text']}
                  headings={['Metric', 'Value', 'Status']}
                  rows={widgetStats}
                />
              </div>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <div style={{ padding: '20px' }}>
              <Text variant="headingMd" as="h3">
                Quick Actions
              </Text>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button onClick={() => navigate('/settings')}>
                  Configure Widgets
                </Button>
                <Button variant="plain">
                  View Analytics
                </Button>
                <Button variant="plain">
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Dashboard; 