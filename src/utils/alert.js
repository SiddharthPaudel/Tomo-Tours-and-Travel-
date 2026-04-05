import Swal from 'sweetalert2';

// Standard Toast for Login/Logout
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#064e3b', // emerald-950
  color: '#ffffff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// 1. Success Toast (Login/Logout)
export const successToast = (message) => {
  Toast.fire({
    icon: 'success',
    iconColor: '#10b981', // emerald-500
    title: `<span style="font-family: Montserrat; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">${message}</span>`
  });
};

// 2. Booking Confirmation (Large Modal)
export const bookingSuccess = (packageName) => {
  return Swal.fire({
    icon: 'success',
    iconColor: '#059669',
    title: `<span style="font-family: Montserrat; font-weight: 900; text-transform: uppercase; font-size: 20px;">Adventure Reserved!</span>`,
    html: `<div style="font-family: Montserrat; font-weight: 500; font-size: 14px; color: #64748b; line-height: 1.6;">
            Your request for <b>${packageName}</b> has been received. Our local guides will contact you shortly.
           </div>`,
    confirmButtonText: 'VIEW MY BOOKINGS',
    confirmButtonColor: '#059669', // emerald-600
    background: '#ffffff',
    customClass: {
      popup: 'rounded-[2.5rem] p-10 shadow-2xl',
      confirmButton: 'rounded-2xl px-10 py-4 font-black text-[10px] tracking-widest'
    }
  });
};

// 3. Signout Confirmation (Question Modal)
export const confirmSignout = () => {
  return Swal.fire({
    title: `<span style="font-family: Montserrat; font-weight: 900; text-transform: uppercase; font-size: 18px;">Sign Out?</span>`,
    text: "Are you sure you want to end your session?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#f43f5e',
    confirmButtonText: 'YES, LOGOUT',
    cancelButtonText: 'STAY',
    customClass: {
      popup: 'rounded-[2.5rem]',
      confirmButton: 'rounded-xl font-black text-[10px]',
      cancelButton: 'rounded-xl font-black text-[10px]'
    }
  });
};