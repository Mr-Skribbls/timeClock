const storage = require('electron-json-storage');

//const dataPath = storage.getDataPath();
const storageKey = 'projects';

function emptyProjects() {
  return new Promise((res, rej) => {
    storage.get(storageKey, (err, data) => {
      if(err) return rej(err);

      data.forEach(wp => {
        wp.projects.forEach(p => {
          p.display_time = '00:00:00';
          p.acc_time = 0;
          p.start = null;
          p.memo = '';
        });
      });

      storage.set(storageKey, data, err => {
        if(err) return rej(err);
        return res(data);
      });

    });
  });
}

function updateProjects(projectsString) {
  storage.set(storageKey, JSON.parse(projectsString), err => {
    if(err) throw err;
  });
}

function getProjectsString() {
  return new Promise((res, rej) => {
    storage.get(storageKey, (err, data) => {
      if(err) rej(err);
      else res(data);
    });
  });
}

function addProject(project) {
  return new Promise((res, rej) => {
    storage.get(storageKey, (err, days) => {
      if(err) rej(err);

      project = createProject(project.name);
      if(!project) rej('Project must have a name');
      days.forEach(day => {
        day.projects.push(project);
      });

      storage.set(storageKey, days, err => {
        if(err) rej(err);
        res(days);
      });
    });
  });
}

function createProject(projectName) {
  if(!projectName) return;
  return {
    acc_time: 0,
    display_time: '00:00:00',
    memo: '',
    name: projectName,
    start: null
  };
}

function removeProject(project) {
  return new Promise((res, rej) => {
    storage.get(storageKey, (err, days) => {
      if(err) rej(err);

      projectName = project.name;
      days = days.map(day => {
        day.projects = day.projects.filter(project => {
          if(project.acc_time > 0 || project.display_time !== '00:00:00' || project.memo || project.start) return true;

          return project.name !== projectName;
        });

        return day;
      });

      storage.set(storageKey, days, err => {
        if(err) rej(err);
        res(days);
      });
    });
  });
}

module.exports = {
  emptyProjects,
  updateProjects,
  getProjectsString,
  addProject,
  removeProject,
};