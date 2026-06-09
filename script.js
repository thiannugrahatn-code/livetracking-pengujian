const API_URL =
"https://script.google.com/macros/s/AKfycbztdpNJKAczD7eT-CYGMuaGaRsKDkrYYTuqZfKHvfzZgbP-SRHog6uJGbtm9OnRyGR5/exec";

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    return new Date(tanggal)
    .toLocaleDateString("id-ID");

}

function badgeStatus(status){

    if(!status){
        return '<span class="status belum">Belum</span>';
    }

    status = status.toLowerCase();

    if(status.includes("selesai")){
        return '<span class="status selesai">Selesai</span>';
    }

    if(status.includes("proses")){
        return '<span class="status proses">Proses</span>';
    }

    return `<span class="status belum">${status}</span>`;
}

async function cariData(){

    const nomor =
    document.getElementById("nomor").value.trim();

    const hasil =
    document.getElementById("hasil");

    if(!nomor){

        hasil.innerHTML = `
        <div class="not-found">
            Masukkan nomor permintaan terlebih dahulu
        </div>
        `;

        return;
    }

    hasil.innerHTML = `
    <div class="not-found">
        Memuat data...
    </div>
    `;

    try{

        const response =
        await fetch(`${API_URL}?nomor=${nomor}`);

        const data =
        await response.json();

        if(data.status === "not found"){

            hasil.innerHTML = `
            <div class="not-found">
                Data tidak ditemukan
            </div>
            `;

            return;
        }

        hasil.innerHTML = `

        <div class="card">

            <h2>${data.namaPelanggan}</h2>

            <div class="grid">

                <div class="item">
                    <div class="label">Nomor Permintaan</div>
                    <div class="value">${data.nomorPermintaan}</div>
                </div>

                <div class="item">
                    <div class="label">Jumlah Sampel</div>
                    <div class="value">${data.jumlahSampel}</div>
                </div>

                <div class="item">
                    <div class="label">Jenis Pengujian</div>
                    <div class="value">${data.jenisPengujian}</div>
                </div>

                <div class="item">
                    <div class="label">Tanggal Bayar</div>
                    <div class="value">${formatTanggal(data.tglBayar)}</div>
                </div>

                <div class="item">
                    <div class="label">Penerimaan Sampel</div>
                    <div class="value">${formatTanggal(data.penerimaanSampel)}</div>
                </div>

                <div class="item">
                    <div class="label">Estimasi Selesai</div>
                    <div class="value">${formatTanggal(data.estimasiSelesai)}</div>
                </div>

                <div class="item">
                    <div class="label">Pengujian</div>
                    <div class="value">
                        ${badgeStatus(data.pengujian)}
                    </div>
                </div>

                <div class="item">
                    <div class="label">Subkontrak</div>
                    <div class="value">
                        ${badgeStatus(data.subkontrak)}
                    </div>
                </div>

                <div class="item">
                    <div class="label">LHP / Sertifikat Terbit</div>
                    <div class="value">
                        ${badgeStatus(data.sertifikat)}
                    </div>
                </div>

                <div class="item">
                    <div class="label">Keterangan</div>
                    <div class="value">
                        ${badgeStatus(data.keterangan)}
                    </div>
                </div>

            </div>

        </div>

        `;

    }catch(error){

        console.error(error);

        hasil.innerHTML = `
        <div class="not-found">
            Gagal mengambil data
        </div>
        `;
    }

}
