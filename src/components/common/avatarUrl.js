import md5 from 'md5';


export default function avatarUrl({ email , size = 200, defaultImage = 'identicon' }) {
    const normalizedEmail = email.trim().toLowerCase();

    const hash = md5(normalizedEmail);

    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;

    return gravatarUrl;
}
