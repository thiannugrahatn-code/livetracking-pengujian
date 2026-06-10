const API_URL =
"https://script.google.com/macros/s/AKfycbztdpNJKAczD7eT-CYGMuaGaRsKDkrYYTuqZfKHvfzZgbP-SRHog6uJGbtm9OnRyGR5/exec";

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID");
}

function getStatusClass(status){

    if(!status) return "belum";

    status = status.toLowerCase();

    if(
        status.includes("selesai") ||
        status.includes("terbit")
    ){
        return "selesai";
    }

    if(
        status.includes("proses") ||
        status.includes("progress") ||
        status.includes("on process")
    ){
        return "proses";
    }

    return "belum";
}

function badgeStatus(status){

    const cls = getStatusClass(status);

    return `
        <span class="status ${cls}">
            ${status || "Belum"}
        </span>
    `;
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
        Sedang mengambil data...
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

        const statusClass =
        getStatusClass(data.keterangan);

        hasil.innerHTML = `

        <div class="card">

            <h2>${data.namaPelanggan}</h2>

            <div class="status-besar ${statusClass}">
                Status : ${data.keterangan}
            </div>

            <div class="timeline">

                <div class="timeline-item">
                    <div class="timeline-title">
                        Penerimaan Sampel
                    </div>
                    <div class="timeline-status">
                        ${formatTanggal(data.penerimaanSampel)}
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-title">
                        Pengujian
                    </div>
                    <div class="timeline-status">
                        ${data.pengujian || "-"}
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-title">
                        Subkontrak
                    </div>
                    <div class="timeline-status">
                        ${data.subkontrak || "-"}
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-title">
                        LHP / Sertifikat
                    </div>
                    <div class="timeline-status">
                        ${data.sertifikat || "-"}
                    </div>
                </div>

            </div>

            <div class="grid">

                <div class="item">
                    <div class="label">
                        Nomor Permintaan
                    </div>
                    <div class="value">
                        ${data.nomorPermintaan}
                    </div>
                </div>

                <div class="item">
                    <div class="label">
                        Jumlah Sampel
                    </div>
                    <div class="value">
                        ${data.jumlahSampel}
                    </div>
                </div>

                <div class="item">
                    <div class="label">
                        Jenis Pengujian
                    </div>
                    <div class="value">
                        ${data.jenisPengujian}
                    </div>
                </div>

                <div class="item">
                    <div class="label">
                        Tanggal Bayar
                    </div>
                    <div class="value">
                        ${formatTanggal(data.tglBayar)}
                    </div>
                </div>

                <div class="item">
                    <div class="label">
                        Estimasi Selesai
                    </div>
                    <div class="value">
                        ${formatTanggal(data.estimasiSelesai)}
                    </div>
                </div>

                <div class="item">
                    <div class="label">
                        Keterangan
                    </div>
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
            Gagal mengambil data dari server
        </div>
        `;
    }
}

document.getElementById("nomor").addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        cariData();
    }

});
