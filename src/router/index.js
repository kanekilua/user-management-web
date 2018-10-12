import Vue from 'vue'
import Router from 'vue-router'
import AccountLogin from '@/components/AccountLogin'
import PhoneLogin from '@/components/PhoneLogin'
import GuestLogin from '@/components/GuestLogin'
import Register from '@/components/Register'
import ResetPwd from '@/components/ResetPwd'
import BindPhone from '@/components/BindPhone'
import UserAgreement from '@/components/UserAgreement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path : '/',
      redirect : 'AccountLogin'
    },
    {
      path: '/AccountLogin',  
      name: 'AccountLogin',
      component: AccountLogin
    },
    {
      path : '/PhoneLogin',
      name : 'PhoneLogin',
      component : PhoneLogin
    },
    {
      path : '/GuestLogin',
      name : 'GuestLogin', 
      component : GuestLogin
    },
    {
      path : '/Register',
      name : 'Register', 
      component : Register
    },
    {
      path : '/ResetPwd',
      name : 'ResetPwd', 
      component : ResetPwd
    },
    {
      path : '/BindPhone',
      name : 'BindPhone', 
      component : BindPhone
    },
    {
      path : '/UserAgreement',
      name : 'UserAgreement', 
      component : UserAgreement
    }
  ]
})
