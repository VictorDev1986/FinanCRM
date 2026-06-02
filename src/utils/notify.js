import Swal from 'sweetalert2'

const base = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
}

export const notify = {
  success(message) {
    Swal.fire({ ...base, icon: 'success', title: message })
  },
  error(message) {
    Swal.fire({ ...base, icon: 'error', title: message })
  },
  info(message) {
    Swal.fire({ ...base, icon: 'info', title: message })
  },
}
