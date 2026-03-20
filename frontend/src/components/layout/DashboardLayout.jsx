import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function DashboardLayout() {

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Anuj Maurya"
  }

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAV */}
        <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b">

          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600">
              Hi, {user.name}
            </span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>

  )
}