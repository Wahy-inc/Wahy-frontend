export default function dashboardPage() {
    return (
        <div className="flex flex-row justify-between">
            <div id="sidebar" className="bg-slate-900 text-slate-100 w-20 lg:w-2xl h-full rounded-r-xl shadow-lg m-4 p-4">
                <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
            </div>
            <div id="content"></div>
        </div>
    )
}