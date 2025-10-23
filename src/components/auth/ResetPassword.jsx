'use client'
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import FirebaseData from '@/utils/Firebase'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
import { sendPasswordResetEmail } from 'firebase/auth'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const ResetPassword = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const emailRef = useRef()

  const { auth } = FirebaseData()

  // auth password reset
  const passwordReset = async email => {
    let promise = await new Promise(function (resolve, reject) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          resolve(`Password Reset Email sent to ${email}`)
        })
        .catch(error => {
          reject(error)
        })
    })

    return promise
  }

  // calling auth password reset
  const handlePasswordReset = e => {
    
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const email = emailRef.current.value
    passwordReset(email)
      .then(msg => {
        setMessage(msg)
        setLoading(false)
      })
      .catch(error => {
        toast.error(error.message)
        setLoading(false)
      })
  }
  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus()
    }, 100)
  }, [])
  return (
    <Layout>
      <div className='container  mb-16'>
        <div className='max-w-[600px] w-full m-auto mt-14 mb-40'>
          <div className='morphisam darkSecondaryColor dark:rounded-[32px]'>
            <div className='p-5 relative'>
              <h3 className='mb-4 flex flex-start text-[40px] font-semibold text-text-color'>{t('forgot_pass')}?</h3>
              <p className='text-text-color'>{t('send_link_to_get_account')}</p>

              <form onSubmit={e => handlePasswordReset(e)}>
                <div className='mb-3 relative inline-block w-full  mt-3'>
                  <Input
                    id='email'
                    type='email'
                    placeholder={t('enter_email')}
                    className='darkSecondaryColor w-full rounded-[8px] bg-white h-16 pl-14 mb-2 text-[#212529] border-none border-gray-300 '
                    ref={emailRef}
                    required={true}
                  />
                  <span className='absolute top-0 left-0 w-12 h-16 flex justify-center items-center text-[#ddd]'>
                    <HiOutlineMail style={{color: '#918ea0'}}/>
                  </span>
                </div>
                <Button
                  variant='login'
                  className='w-full rounded-[8px] px-12 py-4 text-lg h-14 '
                  type='submit'
                  disabled={loading}
                >
                  {loading ? t('please_wait') : t('send')}
                </Button>
                {message && <p className='flex-center mt-5 text-text-color'>{message}</p>}
                <div className=' flex-center mt-3'>
                  <p>
                    <span>
                      <Link className='text-text-color flex' href={'/auth/login'}>
                        <IoMdArrowRoundBack className='mr-2 mt-1' /> {t('back_to_login')}
                      </Link>
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(ResetPassword)
