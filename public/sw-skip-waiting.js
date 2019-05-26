self.addEventListener('message', e => {
  if (!e.data) {
    return;
  }

  switch (e.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
  }
});
