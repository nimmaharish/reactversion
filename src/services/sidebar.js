let toggler = () => {};

function setSidebarToggle(fn) {
  toggler = fn;
}

function toggle() {
  toggler();
}

const SidebarService = {
  setSidebarToggle,
  toggle,
};

export default SidebarService;
