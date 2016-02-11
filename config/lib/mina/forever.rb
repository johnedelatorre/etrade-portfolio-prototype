###########################################################################
# Forever Tasks
###########################################################################

namespace :forever do
  desc "Start Forever"
  task :start do
    queue %[cd #{deploy_to}/current; source ~/.bash_profile; export NODE_ENV=development && forever start --minUptime 5000 --spinSleepTime 2000 --uid "#{app_name}" -a server.js]
  end

  desc "Restart Forever"
  task :restart do
    invoke :'forever:stop'
    invoke :'forever:start'
  end

  desc "Stop Forever"
  task :stop do
    queue %[cd #{deploy_to}/current; source ~/.bash_profile; export NODE_ENV=development && forever stop #{app_name}]
  end
end
