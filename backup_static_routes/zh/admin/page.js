export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <a href="/zh/admin/create-post" className="block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold mb-4">创建文章</h2>
            <p className="text-gray-600 mb-6">撰写新的吉卜力风格AI艺术指南和教程</p>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg font-medium inline-block">
              开始创建
            </div>
          </div>
        </a>
        
        <a href="/zh/admin/resources" className="block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold mb-4">管理资源</h2>
            <p className="text-gray-600 mb-6">添加、编辑或删除吉卜力风格AI工具和模型</p>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg font-medium inline-block">
              管理资源
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
