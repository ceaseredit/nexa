'use client'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { RootState } from '@/store';
import React from 'react'
import { LuSparkles } from 'react-icons/lu';
import { useSelector } from 'react-redux';

function Page() {

  const user = useSelector((state: RootState) => state.user?.user ?? null);
  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">Settings</h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Manage your preferences
      </p>

      <div className="flex flex-col max-w-2xl p-5 bg-white shadow-xl rounded-3xl mt-7">
        <h1 className=" text-[13px] text-gray-300 font-bold tracking-widest">
          PROFILE
        </h1>

        <div className="flex flex-row items-center gap-5 mt-8">
          <div>
            <Avatar className="size-20">
              <AvatarImage src={user?.image} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-[16px]">{user?.name}</h2>
            <p className="text-gray-500">{user?.emailAddress}</p>
            <div className="flex bg-[#EEF6FF] flex-row items-center gap-2 px-2 py-1 text-[#165DFC] text-[12px] font-semibold rounded-2xl w-fit">
              <LuSparkles />
              <p>Premium Member</p>
            </div>
          </div>
        </div>

        <div className="py-3 mt-10 text-center border-[0.4px] font-semibold rounded-xl bg-[#F9FAFC]">
          <h2 className="text-gray-500">Edit Profile</h2>
        </div>
      </div>

      <div className="flex flex-col max-w-2xl p-5 bg-white shadow-xl rounded-3xl mt-7">
        <h1 className=" text-[13px] text-gray-300 font-bold tracking-widest">
          SECURITY & PREFERENCES
        </h1>

        <div className="flex flex-row items-center gap-5 mt-8 ">
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold">
                  Push Notifications
                </h2>
                <p className="text-[13px] text-gray-500">
                  Alert's for all transactions
                </p>
              </div>
              <div>
                <Switch
                  size="default"
                  id="airplane-mode"
                  className="h-7! w-12!"
                  defaultChecked
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold">Two-Factor Auth</h2>
                <p className="text-[13px] text-gray-500">
                  Extra layer of account security
                </p>
              </div>
              <div>
                <Switch
                  size="default"
                  id="airplane-mode"
                  className="h-7! w-12!"
                  defaultChecked
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold">Biometric Login</h2>
                <p className="text-[13px] text-gray-500">
                  Face ID / Fingerprint unlock
                </p>
              </div>
              <div>
                <Switch
                  size="default"
                  id="airplane-mode"
                  className="h-7! w-12!"
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="py-3 mt-10 text-center border-[0.4px] font-semibold rounded-xl bg-[#F9FAFC]">
          <h2 className="text-gray-500">Edit Profile</h2>
        </div> */}
      </div>
    </div>
  );
}

export default Page;