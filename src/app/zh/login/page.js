export default function LoginPage() {
  return (
    <div className="container py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="relative bg-card rounded-3xl border border-border shadow-ghibli p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-blue via-ghibli-green to-accent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-serif font-semibold tracking-wide text-center mb-8 ghibli-title">登录</h1>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-base font-medium mb-2">
                  密码
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 border border-border bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full ghibli-button text-base py-6"
              >
                登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
