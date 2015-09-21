using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Aurelia.Mvc.UI.Startup))]
namespace Aurelia.Mvc.UI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
