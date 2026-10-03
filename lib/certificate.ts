"use client";

import { Student, TestRecord, Settings } from "./types";

function drawLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // dark rounded tile
  ctx.save();
  ctx.fillStyle = "#0c0d10";
  roundRect(ctx, cx - r, cy - r, r * 2, r * 2, r * 0.3);
  ctx.fill();
  // gold ring (open arc)
  ctx.strokeStyle = "#f2bb4a";
  ctx.lineWidth = r * 0.17;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx - r * 0.08, cy + r * 0.02, r * 0.52, 0.35 * Math.PI, 2.55 * Math.PI);
  ctx.stroke();
  // teal dot
  ctx.fillStyle = "#3ddcb0";
  ctx.beginPath();
  ctx.arc(cx + r * 0.42, cy - r * 0.42, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  // "i" stem + dot
  ctx.fillStyle = "#f2bb4a";
  roundRect(ctx, cx - r * 0.1, cy - r * 0.08, r * 0.2, r * 0.4, r * 0.08);
  ctx.fill();
  roundRect(ctx, cx - r * 0.11, cy - r * 0.32, r * 0.22, r * 0.2, r * 0.1);
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeCertificateId(student: Student, test: TestRecord) {
  const year = (test.date || "").slice(0, 4) || new Date().getFullYear();
  const hash = (student.id + test.id).replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  return `IBZA-${year}-${hash}`;
}

async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("700 60px 'Playfair Display'"),
      document.fonts.load("400 16px 'Playfair Display'"),
      document.fonts.load("400 54px 'Dancing Script'"),
      document.fonts.load("600 15px 'Inter'"),
      document.fonts.load("400 15px 'Inter'"),
    ]);
  } catch {
    /* fonts may already be loaded; ignore */
  }
}

export async function generateCertificate(
  student: Student,
  test: TestRecord,
  settings: Settings
): Promise<{ blob: Blob; certificateId: string }> {
  await ensureFonts();

  const W = 1600,
    H = 1131; // ~A4 landscape ratio
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const certId = makeCertificateId(student, test);

  // background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0e0f12");
  grad.addColorStop(1, "#1a1b20");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // watermark logo (faint, center)
  ctx.save();
  ctx.globalAlpha = 0.05;
  drawLogo(ctx, W / 2, H / 2, 300);
  ctx.restore();

  // borders
  ctx.strokeStyle = "#d8a934";
  ctx.lineWidth = 7;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.strokeStyle = "#2f9a84";
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  // corner flourishes
  ctx.strokeStyle = "#d8a934";
  ctx.lineWidth = 2;
  [
    [52, 52, 1, 1],
    [W - 52, 52, -1, 1],
    [52, H - 52, 1, -1],
    [W - 52, H - 52, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x as number, (y as number) + 40 * (dy as number));
    ctx.lineTo(x as number, y as number);
    ctx.lineTo((x as number) + 40 * (dx as number), y as number);
    ctx.stroke();
  });

  ctx.textAlign = "center";

  // logo + institute name
  drawLogo(ctx, W / 2 - 230, 150, 34);
  ctx.fillStyle = "#f2bb4a";
  ctx.font = "700 34px 'Playfair Display', serif";
  ctx.textAlign = "left";
  ctx.fillText(settings.instituteName, W / 2 - 180, 140);
  ctx.fillStyle = "#3ddcb0";
  ctx.font = "600 14px 'Inter', sans-serif";
  ctx.fillText(settings.tagline.split("").join(" "), W / 2 - 180, 168);

  ctx.textAlign = "center";

  // title
  ctx.fillStyle = "#ffffff";
  ctx.font = "400 44px 'Playfair Display', serif";
  ctx.fillText("Certificate of Achievement", W / 2, 280);
  ctx.strokeStyle = "#d8a934";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 110, 305);
  ctx.lineTo(W / 2 + 110, 305);
  ctx.stroke();

  // body
  ctx.fillStyle = "#cfcfcf";
  ctx.font = "400 18px 'Inter', sans-serif";
  ctx.fillText("This is to certify that", W / 2, 365);

  ctx.fillStyle = "#f2bb4a";
  ctx.font = "400 68px 'Dancing Script', cursive";
  ctx.fillText(student.name, W / 2, 450);

  ctx.fillStyle = "#aaaaaa";
  ctx.font = "400 16px 'Inter', sans-serif";
  const batchLine = student.batch ? `Enrolled in ${student.batch}` : "";
  if (batchLine) ctx.fillText(batchLine, W / 2, 485);

  ctx.fillStyle = "#e8e8e8";
  ctx.font = "400 19px 'Inter', sans-serif";
  ctx.fillText("has successfully passed the assessment", W / 2, 535);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 27px 'Playfair Display', serif";
  ctx.fillText(test.testName, W / 2, 578);

  ctx.fillStyle = "#8f8f8f";
  ctx.font = "400 15px 'Inter', sans-serif";
  const dateStr = test.date
    ? new Date(test.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";
  ctx.fillText(`conducted on ${dateStr}`, W / 2, 608);

  // seal
  const sealX = W / 2,
    sealY = 700,
    sealR = 58;
  ctx.save();
  ctx.strokeStyle = "#2f9a84";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#d8a934";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f2bb4a";
  ctx.font = "700 22px 'Inter', sans-serif";
  ctx.fillText("PASS", sealX, sealY + 8);
  ctx.restore();

  // certificate id + date issued (bottom-left)
  ctx.textAlign = "left";
  ctx.fillStyle = "#8f8f8f";
  ctx.font = "400 13px 'Inter', sans-serif";
  ctx.fillText(`Certificate ID: ${certId}`, 100, H - 150);
  ctx.fillText(`Issued: ${new Date().toLocaleDateString("en-IN")}`, 100, H - 128);
  if (student.dob) {
    ctx.fillText(`Date of Birth: ${new Date(student.dob + "T00:00:00").toLocaleDateString("en-IN")}`, 100, H - 106);
  }

  // signature (bottom-right)
  ctx.textAlign = "right";
  ctx.fillStyle = "#f2bb4a";
  ctx.font = "400 42px 'Dancing Script', cursive";
  ctx.fillText(settings.signatoryName, W - 110, H - 150);
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W - 330, H - 128);
  ctx.lineTo(W - 100, H - 128);
  ctx.stroke();
  ctx.fillStyle = "#e8e8e8";
  ctx.font = "600 15px 'Inter', sans-serif";
  ctx.fillText(settings.signatoryName, W - 110, H - 108);
  ctx.fillStyle = "#8f8f8f";
  ctx.font = "400 13px 'Inter', sans-serif";
  ctx.fillText(settings.signatoryTitle, W - 110, H - 88);

  // footer note
  ctx.textAlign = "center";
  ctx.fillStyle = "#3ddcb0";
  ctx.font = "600 13px 'Inter', sans-serif";
  ctx.fillText(
    "This certificate is digitally generated and valid for the student's future endeavors.",
    W / 2,
    H - 60
  );

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), "image/png", 1)
  );
  return { blob, certificateId: certId };
}
