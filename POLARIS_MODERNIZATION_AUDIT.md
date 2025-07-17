# Polaris Modernization Audit

## 📊 **Current Component Usage Analysis**

### **Files Requiring Updates: 7 files**

#### **1. App.js** ✅ *Modern*
```javascript
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
```
**Status**: Already modern, no changes needed

#### **2. Dashboard.js** ✅ *Modern*
```javascript
import {
  Page, Layout, Card, Text, Button, Badge, DataTable, Link
} from '@shopify/polaris';
```
**Status**: All components are modern, no changes needed

#### **3. WidgetSettings.js** ⚠️ *Needs Updates*
```javascript
import {
  Page, Layout, Card, Text, Button, TextField, Select, Checkbox,
  FormLayout, Banner, Toast, Frame, Spinner, Badge, 
  LegacyStack,  // ← DEPRECATED
  Divider
} from '@shopify/polaris';
```
**Changes Needed**:
- `LegacyStack` → `Stack`

#### **4. BNPLOptionsToggle.js** ⚠️ *Needs Updates*
```javascript
import {
  Card, Text, Checkbox, 
  LegacyStack,  // ← DEPRECATED
  Badge, Banner, Button, Icon, Tooltip
} from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';  // ← MISSING IN V8+
```
**Changes Needed**:
- `LegacyStack` → `Stack`
- `InfoIcon` → `CircleInformationMajor` (or `InfoMinor`)

#### **5. LogoSelector.js** ❌ *Major Updates*
```javascript
import {
  Card, Text, Button, Stack, Thumbnail, Banner, DropZone,
  LegacyStack,  // ← DEPRECATED
  Caption,      // ← DEPRECATED (already fixed in PredefinedLogoSelector)
} from '@shopify/polaris';
```
**Changes Needed**:
- `LegacyStack` → `Stack`
- `Caption` → `Text variant="bodySm" color="subdued"`

#### **6. PlacementSelector.js** ⚠️ *Needs Updates*
```javascript
import {
  Card, Text, RadioButton,
  LegacyStack,  // ← DEPRECATED
  Badge, Banner, Button, Icon, Tooltip, Modal, TextContainer
} from '@shopify/polaris';
import { ViewIcon, InfoIcon } from '@shopify/polaris-icons';  // ← MISSING IN V8+
```
**Changes Needed**:
- `LegacyStack` → `Stack`
- `InfoIcon` → `CircleInformationMajor` (or `InfoMinor`)
- `ViewIcon` → `ViewMajor` (or `ViewMinor`)

#### **7. PredefinedLogoSelector.js** ✅ *Recently Fixed*
```javascript
import {
  Card, Text, Stack, Thumbnail, Banner, LegacyStack, ButtonGroup,
  Button, Badge, Divider
} from '@shopify/polaris';
```
**Status**: Caption already fixed, but still has `LegacyStack`
**Changes Needed**:
- `LegacyStack` → `Stack`

---

## 🎯 **Modernization Plan Summary**

### **Component Replacements Needed:**

| Component | Files Affected | Replacement | Complexity |
|-----------|---------------|-------------|------------|
| `LegacyStack` | 5 files | `Stack` | Low |
| `Caption` | 1 file | `Text variant="bodySm" color="subdued"` | Low |
| `InfoIcon` | 2 files | `CircleInformationMajor` | Low |
| `ViewIcon` | 1 file | `ViewMajor` | Low |

### **Execution Plan:**
1. ✅ **Research icon replacements** - COMPLETE
   - `InfoIcon` → `CircleInformationMajor`
   - `ViewIcon` → `ViewMajor`
2. **Replace LegacyStack** (5 files)
3. **Fix remaining Caption** (LogoSelector.js)
4. **Update icon imports** (2 files)
5. **Test all changes comprehensively**

### **Risk Assessment:**
- **Low Risk**: All replacements have confirmed direct equivalents
- **Medium Risk**: None identified
- **High Risk**: None identified

---

## 📝 **Current Status:**
- ✅ Phase 1: Dependency analysis complete
- ✅ Phase 2: Icon research complete  
- 🔄 Phase 3: Component API updates (ready to begin)

---

## 🎯 **Next Actions:**
1. Replace all `LegacyStack` with `Stack`
2. Fix `Caption` in LogoSelector.js
3. Update icon imports with modern equivalents
4. Test comprehensive functionality
5. Validate build success 