import { NavLink } from "react-router-dom"
import { useState } from "react"
import ProfileModal from "../common/ProfileModal"

export default function Sidebar(){

  const [open,setOpen]=useState(false)

  const user=JSON.parse(localStorage.getItem("user")) || {}

  const logout=()=>{
    localStorage.clear()
    window.location.href="/login"
  }

  const plan=user?.plan || "FREE"

  return(

    <div className="w-64 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col justify-between">

      <div>

        <div className="p-6 text-2xl font-bold">
          Invoice<span className="text-indigo-400">AI</span>
        </div>

        <nav className="px-3 space-y-2 text-sm">

          <SidebarLink to="/dashboard" label="Dashboard"/>
          <SidebarLink to="/dashboard/invoices" label="Invoices"/>
          <SidebarLink to="/dashboard/create-invoice" label="Create Invoice"/>
          <SidebarLink to="/dashboard/create-ai" label="AI Invoice"/>

        </nav>

      </div>


      <div className="p-4 border-t border-white/10">

        <div
          onClick={()=>setOpen(true)}
          className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-3 rounded-xl"
        >

          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{plan} USER</p>
          </div>

        </div>

        <button
          onClick={logout}
          className="mt-4 w-full py-2 bg-red-500 rounded-lg"
        >
          Logout
        </button>

      </div>

      {open && <ProfileModal user={user} onClose={()=>setOpen(false)}/>}

    </div>

  )

}

function SidebarLink({to,label}){

  return(

    <NavLink
      to={to}
      className={({isActive}) =>
        `block px-4 py-2 rounded-lg ${
          isActive
            ? "bg-indigo-600"
            : "text-gray-300 hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>

  )

}