###########################################################################
# Upstart Tasks
###########################################################################

namespace :upstart do
  desc "Upload and update (link) all Upstart config file"
  task :update => [:upload, :link]
  
  desc "Symlink config file"
  task :link do
    queue %{echo "-----> Symlink Upstart config file"}
    queue echo_cmd %{sudo ln -fs "#{config_path}/upstart.conf" "#{upstart_config}"}
    queue check_symlink upstart_config
  end

  desc "Parses Upstart config file and uploads it to server"
  task :upload do
    upload_template 'upstart config', "upstart.#{project_type}.conf", "#{config_path}/upstart.conf"
  end
  
  desc "Parses config file and outputs it to STDOUT (local task)"
  task :parse do
    puts "#"*80
    puts "# upstart.conf"
    puts "#"*80
    puts erb("#{config_templates_path}/upstart.#{project_type}.conf.erb")
  end
end
