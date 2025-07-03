 let page = 1;
    const limit = 5;
    let sortField = 'nama';
    let sortOrder = 'ASC';

    async function fetchLokasi() {
      const search = document.getElementById('searchInput').value || '';
      const res = await fetch(`/api/lokasi?page=${page}&limit=${limit}&search=${search}&sort=${sortField}&order=${sortOrder}`);
      const json = await res.json();
      const table = document.getElementById('lokasiTable');
      const pagination = document.getElementById('pagination');
      table.innerHTML = '';
      pagination.innerHTML = '';

      json.data.forEach(l => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-4 py-2 border-b">${l.nama}</td>
          <td class="px-4 py-2 border-b">${l.alamat}</td>
          <td class="px-4 py-2 border-b">
            <button onclick="editLokasi(${l.id}, '${l.nama}', '${l.alamat}')" class="px-3 py-1 bg-yellow-400 text-black rounded mr-2">Edit</button>
            <button onclick="deleteLokasi(${l.id})" class="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
          </td>
        `;
        table.appendChild(row);
      });

      const totalPages = Math.ceil(json.total / limit);
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `px-3 py-1 rounded ${i === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.onclick = () => { page = i; fetchLokasi(); };
        pagination.appendChild(btn);
      }
    }

    function showModal(id = '', nama = '', alamat = '') {
      document.getElementById('lokasiId').value = id;
      document.getElementById('nama').value = nama;
      document.getElementById('alamat').value = alamat;
      document.getElementById('modalTitle').innerText = id ? 'Edit Lokasi' : 'Tambah Lokasi';
      document.getElementById('lokasiModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('lokasiModal').classList.add('hidden');
    }

    async function saveLokasi(e) {
      e.preventDefault();
      const id = document.getElementById('lokasiId').value;
      const nama = document.getElementById('nama').value;
      const alamat = document.getElementById('alamat').value;

      if (id) {
        await fetch(`/api/lokasi/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, alamat }),
        });
        showToast('Lokasi diperbarui!');
      } else {
        await fetch('/api/lokasi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, alamat }),
        });
        showToast('Lokasi ditambahkan!');
      }

      closeModal();
      fetchLokasi();
    }

    function editLokasi(id, nama, alamat) {
      showModal(id, nama, alamat);
    }

    async function deleteLokasi(id) {
      if (confirm('Yakin mau dihapus?')) {
        await fetch(`/api/lokasi/${id}`, { method: 'DELETE' });
        showToast('Lokasi dihapus!');
        fetchLokasi();
      }
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.innerText = message;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2000);
    }

    function sortTable(field) {
      if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortField = field;
        sortOrder = 'ASC';
      }
      fetchLokasi();
    }

    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('-translate-x-full');
    }

    fetchLokasi();