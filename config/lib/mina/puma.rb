###########################################################################
# Puma Tasks
###########################################################################

namespace :puma do
  desc "Start Puma"
  task :start => :environment do
    queue "sudo start puma app=#{deploy_to}/#{current_path}"
  end

  desc "Restart Puma"
  task :restart => :environment do
    invoke :stop
    invoke :start
    queue! 'sudo service nginx restart'
  end

  desc "Stop Puma"
  task :stop => :environment do
    queue "sudo stop puma app=#{deploy_to}/#{current_path}"
  end
end
