import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import UserTypeCard from './user-type-card'

type Props = {
    register: UseFormRegister<FieldValues>
    userType: 'INTERNSHIP_FINDER' | 'RECRUITER'
    setUserType: React.Dispatch<React.SetStateAction<'INTERNSHIP_FINDER' | 'RECRUITER'>>
}

const TypeSelectionForm = ({ register, setUserType, userType }: Props) => {

  return (
    <>
       <h2 className='text-gravel md:text-4xl font-bold'>Create an Account</h2>
       <p className='text-iridium md:text-sm'>
            Tell us about yourself! What do you do? Let&apos;s tailor your
            experience so it best suits you.
       </p>
       <UserTypeCard
            register={register}
            setUserType={setUserType}
            userType={userType}
            value='INTERNSHIP_FINDER'
            title='I am a student'
            text='Looking for Internships.'
       />
          <UserTypeCard
              register={register}
              setUserType={setUserType}
              userType={userType}
              value='RECRUITER'
              title='I own a business'
              text='Setting up an account for my Company.'
          />
    </>
  )
}

export default TypeSelectionForm