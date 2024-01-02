import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

  function Customer() {
    const entity = 'client';
    const searchConfig = {
      displayLabels: ['company'],
      searchFields: 'company,managerSurname,managerName',
      outputValue: '_id',
    };
  
    const entityDisplayLabels = ['company'];
  
    const readColumns = [
      {
        title: 'Empresa',
        dataIndex: 'company',
      },
      {
        title: 'CIF',
        dataIndex: 'managerSurname',
      },
      {
        title: 'Nombre',
        dataIndex: 'managerName',
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Tarifa',
        dataIndex: 'phone',
      },
      {
        title: 'Dirección',
        dataIndex: 'address',
      },
    ];
    const dataTableColumns = [
      {
        title: 'Empresa',
        dataIndex: 'company',
      },
      {
        title: 'CIF',
        dataIndex: 'managerSurname',
      },
      {
        title: 'Nombre',
        dataIndex: 'managerName',
      },
      {
        title: 'Dirección',
        dataIndex: 'address',
      },
      {
        title: 'Tarifa',
        dataIndex: 'phone',
      },
    ];
  
    const ADD_NEW_ENTITY = 'Añadir cliente';
    const DATATABLE_TITLE = 'Listado de clientes';
    const ENTITY_NAME = 'cliente';
    const CREATE_ENTITY = 'Crear cliente';
    const UPDATE_ENTITY = 'Actualizar cliente';
    const PANEL_TITLE = 'Panel de cliente';
  
    const config = {
      entity,
      PANEL_TITLE,
      ENTITY_NAME,
      CREATE_ENTITY,
      ADD_NEW_ENTITY,
      UPDATE_ENTITY,
      DATATABLE_TITLE,
      readColumns,
      dataTableColumns,
      searchConfig,
      entityDisplayLabels,
    };
    return (
      <CrudModule
        createForm={<CustomerForm />}
        updateForm={<CustomerForm isUpdateForm={true} />}
        config={config}
      />
    );
  }
  
  export default Customer;
  