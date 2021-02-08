import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/common/PageContainer';
import CardTable from '../../components/common/CardTable';
import Modal from '../../components/common/Modal';

import { observer, inject } from 'mobx-react';

// Local components
import HeaderComponents from './HeaderComponents';
import Form from './Form';

// Controllers
import UserManagementController from '../../Controllers/UserManagementController';

export default inject('store')(
  observer(({ store }) => {
    const { t } = useTranslation('common'); //translation
    const { columns, handleAdd, modal, form, setUserType, userType, sendEmailInvitation, setSendEmailInvitation } = UserManagementController(store);

    return (
      <PageContainer title={t('User Management')}>
        <Modal
          modal={modal}
          modalContent={Form(
            form,
            modal,
            { data: store.users.userTypes, setValue: setUserType, value: userType },
            sendEmailInvitation,
            setSendEmailInvitation
          )}
        />
        <CardTable dataSource={store.users.state} columns={columns} headerComponents={HeaderComponents(handleAdd)} searchProperties={['name', 'email']} />
      </PageContainer>
    );
  })
);
