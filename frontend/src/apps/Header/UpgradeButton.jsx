import { Avatar, Popover, Button, Badge } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function UpgradeButton() {


  return (
    <Button
    type="primary"
    href="https://elgatoconbolsas.es/wp-admin"
    style={{ marginRight: '0.5rem' }}
  >
    Administrar web
  </Button>
  );
}

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
